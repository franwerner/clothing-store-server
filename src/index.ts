import express from "express"
import corsConfig from "./config/cors.config.js"
import "./config/dotenv.config.js"
import "./config/mercadopago.config.js"
import "./config/store.config.js"
import sessionConfig from "./config/session.config.js"
import _env from "./constant/_env.constant.js"
import errorGlobal from "./middleware/errorGlobal.middleware.js"
import limiter from "./rate-limiter/default.rate-limiter.js"
import createRouters from "./router/index"
import UserTokenService from "./service/userToken.service.js"
import isMaintenance from "./middleware/isMaintenance.middleware.js"
import sql from "./config/knex.config.js"

const port = _env.BACKEND_PORT
const app = express()
app.use(limiter)
app.use(express.json())
app.use(sessionConfig)
app.use(isMaintenance)
app.use(corsConfig)

try {
   const [{expire_at}] = await sql("user_purchases").where({user_fk : 201}).orderBy("create_at","desc").limit(1)
    console.log(expire_at)
} catch (error) {
    console.log(error)
}
createRouters(app)
app.use(errorGlobal)
UserTokenService.cleanExpiredTokens({ cleaning_hour: 15, cleaning_minute: 0 }) //12PM en UTC -3(ARG)
app.listen(port, () => console.log("SERVER START"))
