import redis_client from "../configs/redis.config";

const setRedisValue = async (key: string, value: object | string): Promise<string> => {
  const data = await redis_client.set(key.toString(), JSON.stringify(value))
  await redis_client.expire(key.toString(), 259200)
  if (!data) throw new Error()

  return data
}

const getRedisValue = async (key: string): Promise<string | null> => {
  const data = await redis_client.get(key.toString())

  return data
}

const delRedisValue = async (key: string): Promise<void> => {
  const data = await redis_client.del(key.toString())
  if (!data) throw new Error
}

export {setRedisValue, getRedisValue, delRedisValue }