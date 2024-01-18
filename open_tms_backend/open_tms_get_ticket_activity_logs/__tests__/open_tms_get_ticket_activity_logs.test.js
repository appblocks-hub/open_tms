
import handler from '../index'
import request from 'supertest'

describe('POST /open_tms_backend/open_tms_get_ticket_activity_logs', () => {
  it('should retrieve ticket activity logs for a ticket and return a success message', async () => {
    const response = await request(handler).post('/open_tms_backend/open_tms_get_ticket_activity_logs').send({
      ticket_id: '9fc38479-1619-48d1-8aa6-996cff08a5bb', // Replace with request body data
    })

    expect(response.status).toBe(200)
    expect(response.body.meta).toEqual({
      status: 200,
      message: 'Ticket data retrieved successfully',
    })
  })

  it('should handle errors and return an error message', async () => {
    // Mock the Prisma transaction to throw an error
    jest.spyOn(handler.prisma, '$queryRaw').mockRejectedValue(new Error('Query error'))

    const response = await request(handler).post('/api/open_tms_get_ticket_activity_logs').send({
      ticket_id: '9fc38479-1619-48d1-8aa6-996cff08a5bb', // Replace with request body data
    })

    expect(response.status).toBe(500)
    expect(response.meta).toEqual({
      status: 500,
      message: 'Something went wrong.',
    })
  })
})