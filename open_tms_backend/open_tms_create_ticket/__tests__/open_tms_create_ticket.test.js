const request = require('jest');
const app = require('../index');

describe('POST /open_tms_backend/open_tms_create_ticket', () => {
  it('should create a ticket and return a success message', async () => {
    // Mock user context for authentication
    const mockUser = {
      id: 123, // Replace with the actual user ID3
    };

    // Mock authentication middleware to set the user context
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });

    const response = await request(app)
      .post('/open_tms_backend/open_tms_create_ticket')
      .send({
        // Replace with request body data
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Ticket created successfully' });
  });

  it('should handle errors and return an error message', async () => {
    // Mock user context for authentication
    const mockUser = {
      id: 123, // Replace with the actual user ID
    };

    // Mock authentication middleware to set the user context
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });

    // Mock the Prisma transaction to throw an error
    jest.spyOn(app.prisma, '$transaction').mockRejectedValue(new Error('Transaction error'));

    const response = await request(app)
      .post('/api/open_tms_create_ticket')
      .send({
        // Replace with request body data
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'An error occurred while processing the request' });
  });
});
