import { rateLimit } from "express-rate-limit"
import rateLimitHandler from "../utils/rateLimitHandler.utilts"

const tokenRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 20,
    handler: rateLimitHandler
})

export default tokenRateLimiter