import { rateLimit } from "express-rate-limit"
import rateLimitHandler from "../utils/rateLimitHandler.utilts"

const tokenRateLimiter = rateLimit({
    windowMs: 1000 * 30,
    limit: 1,
    handler: rateLimitHandler
})

export default tokenRateLimiter