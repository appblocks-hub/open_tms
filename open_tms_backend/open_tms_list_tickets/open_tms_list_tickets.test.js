import { shared } from '@appblocks/node-sdk'
import { handler } from './index'

describe('Handler function', () => {
  it('should handle a successful request', async () => {
    const req = {
      user: {
        id: 'valid_userID',
      },
    }
    const res = {}
    await handler({ req, res })
    expect(shared.getShared().sendResponse).toHaveBeenCalledWith(res, 200, expect.any(Object))
  })
})
