import session from "express-session"
import _env from "../constant/_env.constant.js"

const sessionConfig = session({
    secret: crypto.randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias,
        secure: _env.NODE_ENV == "prod",
        httpOnly: true
    },
})

export default sessionConfig