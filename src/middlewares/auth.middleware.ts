import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/users.model";
import { getRedisValue } from "../utils/redis.util";
const jwt = require('jsonwebtoken')

interface IDecoded extends JwtPayload {
  id: string
  iat: number
  exp: number
}

const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.header('Authorization')?.replace('Bearer ', '')

    if (!token) throw new Error('Token is Invalid')

    const decoded: IDecoded = await jwt.verify(token, 'verysecretjwttokenmsg')
    const user = await User.findById(decoded.id)

    if (!user || !decoded) throw new Error('Authentication Failed')

    const data = await getRedisValue('BL_' + decoded.id)

    if (data === token) return res.status(401).send({ error: 'blacklisted token.' })

    res.locals.user = user
    res.locals.token = token

    next()
  } catch (err) {
    let errorMessage = 'Please Authentication is required!'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(401).send({ error: 'Your session is not valid. ' + err.message ?? errorMessage })
  }
}

const verifyTokenStored = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = res.locals.user
    const token = res.locals.token

    const data = await getRedisValue(userData?.id)

    if (data === null) {
      return res.status(401).send({ error: 'Invalid request. Token is not in store.' })
    }

    if (JSON.parse(data).token !== token) {
      return res.status(401).send({ error: 'Invalid request. Token not equal one in redis store.' })
    }

    next()
  } catch (err) {
    let errorMessage = 'Please Authentication is required!'
    if (err instanceof Error) {
      errorMessage = err.message
    }
    res.status(401).send({ error: 'Your session is not valid. ' + err.message ?? errorMessage })
  }
}

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userData = res.locals.user

  if (userData && userData.isAdmin) {
    next()
  } else {
    return res.status(403).send({ error: 'UnAuthorized You are not an Admin' })
  }
}


export { verifyUserToken, verifyTokenStored, verifyAdmin }