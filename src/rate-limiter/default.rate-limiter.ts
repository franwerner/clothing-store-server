import rateLimitHandler from "@/helper/rateLimiterHandler.helper"
import { rateLimit } from "express-rate-limit"


const defaultLimiter = rateLimit({
     windowMs: 5 * 60 * 1000, //5 minutos 
     limit: 1000,
     handler: rateLimitHandler
})


export default defaultLimiter