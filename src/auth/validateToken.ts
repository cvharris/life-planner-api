import { redisClient } from '../conf/redisConnection'

export const validateToken = async (decoded, ctx, next) => {
    let userInfo = await redisClient.getAsync(decoded.id)

    if (userInfo) {
      next(null, true)
    } else {
      next(null, false)
    }
}