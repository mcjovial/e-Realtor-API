import redis_client from "../configs/redis.config"

(async (): Promise<void> => {
  try {
    redis_client.on('error', (err) => console.log('Redis client error', err))

    await redis_client.connect()
    console.log('Redis Connected Successfully!')
  } catch (err) {
    console.log(err)
    redis_client.quit()
    process.exit(1)
  }
})()