import { Application } from "express"
import isAdmin from "../middleware/isAdmin.middleware"
import isCompleteUser from "../middleware/isCompleteUser.middleware"
import categoriesRouter from "./categories/categories.router"
import mercadoPagoRouter from "./mercadopago/mercadoPago.router"
import orderRouter from "./order/order.router"
import shopcartRouter from "./shopcart/shopcart.router"
import guestQuestionsRouter from "./guest-questions/guestQuestions.router"
import brandsRouter from "./brands/brands.router"
import userInfoRouter from "./user-info/userInfo.router"
import colorsRouter from "./colors/colors.router"
import productColorImagesRouter from "./product-color-images/ProductColorImages.router"
import productsRouter from "./products/products.router"
import productRecomendationsRouter from "./product-recomendations/productRecomendations.router"
import productColorsRouter from "./product-colors/productColors.router"
import productColorSizesRouter from "./product-color-sizes/ProductColorSizes.router"
import sizesRouter from "./sizes/sizes.router"
import productsViewRouter from "./products-view/productsView.router"
import userRegisterRouter from "./user-register/userRegister.router"
import UserSession from "./user-session/userSession.router"
import userAddresessRouter from "./user-addresess/userAddresess.router"
import storeConfigRouter from "./store-config/storeConfig.router"

const createRouters = (app: Application) => {
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
    app.use("/users/session", UserSession)
    app.use("/users/register", userRegisterRouter)
    app.use("/users/info", userInfoRouter)
    app.use("/users/addresess", isCompleteUser, userAddresessRouter)
    app.use("/guests/questions", guestQuestionsRouter)
    app.use("/mercadopago", isCompleteUser, mercadoPagoRouter)
    app.use("/orders", orderRouter)
    app.use("/shopcart", shopcartRouter)
    app.use("/store/config", storeConfigRouter)
}

export default createRouters