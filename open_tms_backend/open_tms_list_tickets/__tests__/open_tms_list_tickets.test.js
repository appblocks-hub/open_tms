const request = require('jest');
const app = require('../index.js');

describe('POST open_tms_backend/open_tms_list_tickets', () => {
  it('should return a list of tickets for a valid user', async () => {
    // Mock a valid user object with an ID for testing purposes
    const mockUser = {
      id: 123, //Replace with the actual userID returned from the user object gotten from userResponse during auth
    };

    // Mock the user extraction logic
    const getUserFromAuthentication = jest.fn(() => mockUser);

    const response = await request(app)
      .post('open_tms_backend/open_tms_list_tickets')
      .set('Authorization', 'Bearer validToken'); // Add a valid authorization token

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    // Verify that getUserFromAuthentication was called
    expect(getUserFromAuthentication).toHaveBeenCalled();
  });

  it('should return a 404 status for an invalid user', async () => {
    // Mock an invalid user object
    const invalidUser = {
      id: 999, // Replace with an invalid user ID
    };

    // Mock the user extraction logic to return the invalid user
    const getUserFromAuthentication = jest.fn(() => invalidUser);

    const response = await request(app)
      .get('/api/tickets/latest-revisions')
      .set('Authorization', 'Bearer invalidToken'); // Add an invalid authorization token

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'No data found for the specified user.' });

    // Verify that getUserFromAuthentication was called
    expect(getUserFromAuthentication).toHaveBeenCalled();
  });
});
