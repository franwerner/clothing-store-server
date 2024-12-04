import express, { Request } from "express"
import corsConfig from "./config/cors.config.js"
import "./config/dotenv.config.js"
import "./config/mercadopago.config.js"
import limiter from "./config/rate-limit.config.js"
import sessionConfig from "./config/session.config.js"
import _env from "./constant/_env.constant.js"
import errorGlobal from "./middleware/errorGlobal.middleware.js"
import isAdmin from "./middleware/isAdmin.middleware.js"
import brandsRouter from "./router/brands.router.js"
import categoriesRouter from "./router/categories.router.js"
import colorsRouter from "./router/colors.router.js"
import mercadoPagoRouter from "./router/mercadoPago.router.js"
import orderRouter from "./router/order.router.js"
import productColorImagesRouter from "./router/ProductColorImages.router.js"
import productColorsRouter from "./router/productColors.router.js"
import productColorSizesRouter from "./router/ProductColorSizes.router.js"
import productsRouter from "./router/products.router.js"
import productRecomendationsRouter from "./router/productsRecomendations.router.js"
import productsViewRouter from "./router/productsView.router.js"
import sizesRouter from "./router/sizes.router.js"
import userAccountRouter from "./router/userAccount.router.js"
import userRegisterRouter from "./router/userRegister.router.js"
import usersRouter from "./router/users.router.js"
import UserTokenService from "./service/userToken.service.js"
import isCompleteUser from "./middleware/isCompleteUser.middleware.js"



const port = _env.BACKEND_PORT
const app = express()
app.use(express.json())
app.use(sessionConfig)
app.use(corsConfig)
app.use(limiter)

app.use("/", (req: Request, res, next) => {
    req.session.user = {
        permission: "admin",
        fullname : "fsdada",
        user_id: 37,
        email: "ifrank4444@gmail.com",
        ip : "123",
        phone : null,
        email_confirmed : true
    }
    next()
})

app.use("/categories", categoriesRouter)
app.use("/products", productsRouter)
app.use("/products/recomendations", productRecomendationsRouter)
app.use("/products/view", productsViewRouter)
app.use("/products/colors", isAdmin, productColorsRouter)
app.use("/products/colors/sizes", isAdmin, productColorSizesRouter)
app.use("/products/colors/images", isAdmin, productColorImagesRouter)
app.use("/brands", brandsRouter)
app.use("/sizes", sizesRouter)
app.use("/colors", colorsRouter)
app.use("/users", usersRouter)
app.use("/users/register", userRegisterRouter)
app.use("/users/account", userAccountRouter)
app.use("/mercadopago",isCompleteUser, mercadoPagoRouter)
app.use("/orders",isCompleteUser,orderRouter)
app.use(errorGlobal)

UserTokenService.cleanExpiredTokens({ cleaning_hour: 15, cleaning_minute: 0 }) //12PM en UTC -3(ARG)

app.listen(port, () => console.log("SERVER START"))
