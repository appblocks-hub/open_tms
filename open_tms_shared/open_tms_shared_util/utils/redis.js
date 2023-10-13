import { createClient } from 'redis'

const redis = createClient({
  url: `redis://${process.env.BB_OPEN_TMS_REDIS_HOST}:${process.env.BB_OPEN_TMS_REDIS_PORT}`,
})

redis.on('error', (err) => {
  console.log('\nRedis client1 error ')
  console.log(err)
  console.log('\n')
})

redis.on('connect', () => {
  console.log('\nRedis client connected')
})

export default redis
