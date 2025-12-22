/**
 * Tests for validation schemas from @pickup/shared
 * These tests ensure that the Zod schemas correctly validate input data
 */
import {
  CreateEventSchema,
  JoinEventSchema,
  UpdateRSVPSchema,
  AddAttendeeSchema,
  EventType,
  EventFormat,
  EventPosition,
  AttendeeStatus,
} from '@pickup/shared';
import { CheckoutSessionSchema, VerifyPaymentSchema } from '@pickup/shared';

describe('Event Validation Schemas', () => {
  describe('CreateEventSchema', () => {
    const validEvent = {
      title: 'Beach Volleyball',
      date: '2025-01-15T10:00:00.000Z',
      location: 'Miami Beach',
      type: EventType.VOLLEYBALL,
      format: EventFormat.OPEN_GYM,
    };

    it('should accept valid event data', () => {
      const result = CreateEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    it('should accept event with optional fields', () => {
      const result = CreateEventSchema.safeParse({
        ...validEvent,
        description: 'Fun game at the beach',
        coordinates: { lat: 25.7617, lng: -80.1918 },
        isPaid: true,
        price: 1500,
        currency: 'usd',
      });
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      const result = CreateEventSchema.safeParse({ ...validEvent, title: 'VB' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true);
      }
    });

    it('should reject invalid date format', () => {
      const result = CreateEventSchema.safeParse({ ...validEvent, date: 'not-a-date' });
      expect(result.success).toBe(false);
    });

    it('should reject location shorter than 3 characters', () => {
      const result = CreateEventSchema.safeParse({ ...validEvent, location: 'LA' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid event type', () => {
      const result = CreateEventSchema.safeParse({ ...validEvent, type: 'BASKETBALL' });
      expect(result.success).toBe(false);
    });

    it('should reject paid event without price', () => {
      const result = CreateEventSchema.safeParse({
        ...validEvent,
        isPaid: true,
        price: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('price'))).toBe(true);
      }
    });

    it('should apply default values', () => {
      const result = CreateEventSchema.safeParse(validEvent);
      if (result.success) {
        expect(result.data.isPaid).toBe(false);
        expect(result.data.price).toBe(0);
        expect(result.data.currency).toBe('usd');
      }
    });
  });

  describe('JoinEventSchema', () => {
    it('should accept empty body (positions optional)', () => {
      const result = JoinEventSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept valid positions array', () => {
      const result = JoinEventSchema.safeParse({
        positions: [EventPosition.SETTER, EventPosition.OUTSIDE],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty positions array', () => {
      const result = JoinEventSchema.safeParse({ positions: [] });
      expect(result.success).toBe(true);
    });

    it('should reject invalid position values', () => {
      const result = JoinEventSchema.safeParse({
        positions: ['INVALID_POSITION'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateRSVPSchema', () => {
    it('should accept YES status', () => {
      const result = UpdateRSVPSchema.safeParse({ status: AttendeeStatus.YES });
      expect(result.success).toBe(true);
    });

    it('should accept NO status', () => {
      const result = UpdateRSVPSchema.safeParse({ status: AttendeeStatus.NO });
      expect(result.success).toBe(true);
    });

    it('should accept MAYBE status', () => {
      const result = UpdateRSVPSchema.safeParse({ status: AttendeeStatus.MAYBE });
      expect(result.success).toBe(true);
    });

    it('should accept WAITLIST status', () => {
      const result = UpdateRSVPSchema.safeParse({ status: AttendeeStatus.WAITLIST });
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = UpdateRSVPSchema.safeParse({ status: 'INVALID' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('YES, NO, MAYBE, or WAITLIST');
      }
    });

    it('should reject missing status', () => {
      const result = UpdateRSVPSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('AddAttendeeSchema', () => {
    it('should accept valid email', () => {
      const result = AddAttendeeSchema.safeParse({ email: 'user@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = AddAttendeeSchema.safeParse({ email: 'not-an-email' });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = AddAttendeeSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = AddAttendeeSchema.safeParse({ email: '' });
      expect(result.success).toBe(false);
    });
  });
});

describe('Payment Validation Schemas', () => {
  describe('CheckoutSessionSchema', () => {
    it('should accept valid eventId', () => {
      const result = CheckoutSessionSchema.safeParse({ eventId: '507f1f77bcf86cd799439011' });
      expect(result.success).toBe(true);
    });

    it('should accept eventId with positions', () => {
      const result = CheckoutSessionSchema.safeParse({
        eventId: '507f1f77bcf86cd799439011',
        positions: ['Setter', 'Outside'],
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing eventId', () => {
      const result = CheckoutSessionSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty eventId', () => {
      const result = CheckoutSessionSchema.safeParse({ eventId: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('VerifyPaymentSchema', () => {
    it('should accept valid sessionId', () => {
      const result = VerifyPaymentSchema.safeParse({ sessionId: 'cs_test_abc123' });
      expect(result.success).toBe(true);
    });

    it('should reject missing sessionId', () => {
      const result = VerifyPaymentSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty sessionId', () => {
      const result = VerifyPaymentSchema.safeParse({ sessionId: '' });
      expect(result.success).toBe(false);
    });
  });
});
