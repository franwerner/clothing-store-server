import { Request } from "express"

const rateLimitHandler = (
    req: Request,
    res: APP.ResponseTemplate
) => {
    const currentTime = new Date()
    const time = req.rateLimit?.resetTime || currentTime
    const resetTime = new Date(time)

    const diffToSeconds = (resetTime.getTime() - currentTime.getTime()) / 1000
    const minutes = Math.floor(diffToSeconds / 60)
    const seconds = Math.floor(diffToSeconds % 60)

    res.status(429).json({
        message: `Para continuar con esta operacion deber esperar ${minutes}M ${seconds}S`,
        code: "rate_limit",
        data: {
            seconds,
            minutes,
            date: resetTime
        }
    })
}

export default rateLimitHandler