import express from "express"
import corsConfig from "./config/cors.config.js"
import "./config/dotenv.config.js"
import sessionConfig from "./config/session.config.js"
import errorGlobal from "./middleware/errorGlobal.middleware.js"
import isAdmin from "./middleware/isAdmin.middleware.js"
import brandsRouter from "./router/brands.router.js"
import categoriesRouter from "./router/categories.router.js"
import colorsRouter from "./router/colors.router.js"
import productColorImagesRouter from "./router/ProductColorImages.router.js"
import productColorsRouter from "./router/productColors.router.js"
import productColorSizesRouter from "./router/ProductColorSizes.router.js"
import productsRouter from "./router/products.router.js"
import productRecomendationsRouter from "./router/productsRecomendations.router.js"
import productsViewRouter from "./router/productsView.router.js"
import sizesRouter from "./router/sizes.router.js"
import usersRouter from "./router/users.router.js"
import UserTokenService from "./service/userToken.service.js"

const port = 3000
const app = express()

app.use(express.json())

app.use(sessionConfig)

app.use(corsConfig)

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
app.use(errorGlobal)

UserTokenService.cleanExpiredTokens({ cleaning_hour: 12, cleaning_minute: 0 })

app.listen(port, () => console.log("SERVER START"))