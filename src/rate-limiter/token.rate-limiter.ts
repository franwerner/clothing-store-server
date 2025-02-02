import rateLimitHandler from "@/helper/rateLimiterHandler.helper"
import { rateLimit } from "express-rate-limit"

const tokenRateLimiter = rateLimit({
    windowMs: 1000 * 60,
    limit: 10,
    handler: rateLimitHandler
})

export default tokenRateLimiter