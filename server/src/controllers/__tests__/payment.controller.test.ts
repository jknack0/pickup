import { Request, Response } from 'express';
import * as paymentController from '../payment.controller.js';
import { stripe } from '@/utils/stripe.js';

// Mock dependencies
jest.mock('@/models/Event.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));
jest.mock('@/models/Transaction.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('@/models/User.js');
jest.mock('@/utils/logger.js');
jest.mock('@/utils/stripe.js', () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: jest.fn(),
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

// Import mocked models after mocking (for type access if needed, though we use casting)
import EventModel from '@/models/Event.js';
import TransactionModel from '@/models/Transaction.js';

describe('Payment Controller', () => {
  let mockRequest: Partial<Request> & { user?: { id: string } };
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    mockRequest = {
      user: { id: 'user123' },
      body: {},
    };
    jest.clearAllMocks();
  });

  describe('verifyPayment', () => {
    it('should verify payment and add user to event', async () => {
      mockRequest.body = { sessionId: 'cs_test_123' };
      const mockSession = {
        payment_status: 'paid',
        metadata: {
          type: 'EVENT_JOIN',
          eventId: 'event123',
          positions: JSON.stringify(['Setter']),
        },
        payment_intent: 'pi_123',
        amount_total: 1000,
      };

      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue(mockSession);

      const mockEvent = {
        _id: 'event123',
        attendees: [],
        save: jest.fn(),
      };
      (EventModel.findById as jest.Mock).mockResolvedValue(mockEvent);
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(null); // No existing transaction

      await paymentController.verifyPayment(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      // Check if user was added
      expect(mockEvent.attendees).toHaveLength(1);
      expect(mockEvent.attendees[0]).toEqual(
        expect.objectContaining({
          user: 'user123',
          status: 'YES',
          positions: ['Setter'],
        }),
      );
      expect(mockEvent.save).toHaveBeenCalled();

      // Check transaction creation
      expect(TransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          eventId: 'event123',
          stripePaymentIntentId: 'pi_123',
          amount: 1000,
          type: 'PAYMENT',
          status: 'SUCCEEDED',
        }),
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Payment verified and verified', verified: true }),
      );
    });

    it('should return 400 if payment not completed', async () => {
      mockRequest.body = { sessionId: 'cs_test_incomplete' };
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        payment_status: 'unpaid',
      });

      await paymentController.verifyPayment(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Payment not completed' }),
      );
    });

    it('should return 400 if wrong session type', async () => {
      mockRequest.body = { sessionId: 'cs_test_wrong_type' };
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        payment_status: 'paid',
        metadata: { type: 'OTHER' },
      });

      await paymentController.verifyPayment(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid session type' }),
      );
    });

    it('should handle idempotency (not add user twice)', async () => {
      mockRequest.body = { sessionId: 'cs_test_123' };
      const mockSession = {
        payment_status: 'paid',
        metadata: {
          type: 'EVENT_JOIN',
          eventId: 'event123',
        },
        payment_intent: 'pi_123',
      };
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue(mockSession);

      const mockEvent = {
        attendees: [{ user: 'user123' }], // Already joined
        save: jest.fn(),
      };
      (EventModel.findById as jest.Mock).mockResolvedValue(mockEvent);
      (TransactionModel.findOne as jest.Mock).mockResolvedValue({ _id: 'tx123' }); // Transaction exists

      await paymentController.verifyPayment(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      expect(mockEvent.save).not.toHaveBeenCalled();
      expect(TransactionModel.create).not.toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ verified: true }));
    });
  });

  describe('createCheckoutSession', () => {
    it('should create session with destination charge', async () => {
      mockRequest.body = { eventId: 'event123', positions: ['Setter'] };

      const mockEvent = {
        _id: 'event123',
        price: 1000,
        isPaid: true,
        currency: 'usd',
        title: 'Volleyball Game',
        description: 'Fun game',
        organizer: {
          _id: 'org123',
          stripeAccountId: 'acct_123',
          stripeOnboardingComplete: true,
        },
      };

      (EventModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvent),
      });

      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: 'cs_test_123',
        url: 'http://stripe.com/checkout',
      });

      await paymentController.createCheckoutSession(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_intent_data: expect.objectContaining({
            transfer_data: { destination: 'acct_123' },
            application_fee_amount: 50, // 5% of 1000
          }),
        }),
      );

      expect(jsonMock).toHaveBeenCalledWith({
        sessionId: 'cs_test_123',
        url: 'http://stripe.com/checkout',
      });
    });

    it('should fail if organizer not onboarded', async () => {
      mockRequest.body = { eventId: 'event123' };
      const mockEvent = {
        isPaid: true,
        price: 1000,
        organizer: { stripeAccountId: null },
      };
      (EventModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvent),
      });

      await paymentController.createCheckoutSession(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Organizer cannot accept payments yet' }),
      );
    });
  });
});
