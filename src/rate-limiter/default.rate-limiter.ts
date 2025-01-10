import { rateLimit } from "express-rate-limit"
import rateLimitHandler from "../utils/rateLimitHandler.utilts"


const defaultLimiter = rateLimit({
     windowMs: 5 * 60 * 1000, //5 minutos 
     limit: 1000,
     handler: rateLimitHandler
})


export default defaultLimiter