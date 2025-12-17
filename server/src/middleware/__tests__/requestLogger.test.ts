import { requestLogger } from '../requestLogger.js';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';
import { jest } from '@jest/globals';

// Mock logger
jest.mock('@/utils/logger.js');

describe('requestLogger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test-url',
    };
    // Define strict type for mocked response to avoid any
    type MockResponse = Partial<Response> & {
      on: jest.Mock;
    };

    mockResponse = {
      on: jest.fn(),
      statusCode: 200,
    } as MockResponse;
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next()', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should register a finish event listener', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should log info on finish', () => {
    // Determine the callback passed to res.on
    let finishCallback: (() => void) | undefined;
    (mockResponse.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'finish') {
        finishCallback = callback as () => void;
      }
      return mockResponse as Response;
    });

    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate request finishing
    if (finishCallback) {
      finishCallback();
    }

    expect(logger.info).toHaveBeenCalledWith(
      'Request completed',
      expect.objectContaining({
        method: 'GET',
        url: '/test-url',
        statusCode: 200,
      }),
    );
  });
});
