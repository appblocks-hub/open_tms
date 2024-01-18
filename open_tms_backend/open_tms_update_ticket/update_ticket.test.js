import { shared } from '@appblocks/node-sdk';
import handler from './index'; // Import the handler function

// Mock the shared.getShared() function to provide the required dependencies
shared.getShared = jest.fn(() => ({
  sendResponse: jest.fn(),
  validateRequestMethod: jest.fn(),
  isEmpty: jest.fn(),
  checkHealth: jest.fn(),
  prisma: {
    ticket: {
      findFirst: jest.fn(),
    },
    department: {
      findFirst: jest.fn(),
    },
    stage: {
      findFirst: jest.fn(),
    },
    ticket_revision: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    ticket_activity: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    org_member: {
      findFirst: jest.fn(),
    },
    process: {
      findFirst: jest.fn(),
    },
    process_path: {
      findFirst: jest.fn(),
    },
  },
}));

describe('Handler function', () => {
  it('should return a 400 response when request body is empty', async () => {
    const req = { body: {} };
    const res = {};
    await handler({ req, res });
    // Assert that the sendResponse function was called with a 400 status code
    expect(shared.getShared().sendResponse).toHaveBeenCalledWith(res, 400, {
      message: 'Please provide all required fields',
    });
  });

  // Add more test cases for different scenarios

  // Example test case for a successful request
  it('should handle a successful request', async () => {
    const req = {
      body: {
        ticket_id: 'valid_ticket_id',
        assignee_id: 'valid_assignee_id',
        to_stage: 'valid_stage',
      },
    };
    const res = {};
    await handler({ req, res });
    // Assert that the sendResponse function was called with a 200 status code
    expect(shared.getShared().sendResponse).toHaveBeenCalledWith(res, 200, expect.any(Object));
  });
});
