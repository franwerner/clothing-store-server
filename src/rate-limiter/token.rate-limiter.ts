import { rateLimit } from "express-rate-limit"
import rateLimitHandler from "../utils/rateLimitHandler.utilts"

const tokenRateLimiter = rateLimit({
    windowMs: 1000 * 60,
    limit: 10,
    handler: rateLimitHandler
})

export default tokenRateLimiter