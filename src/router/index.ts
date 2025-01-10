import { Application } from "express"
import isAdmin from "../middleware/isAdmin.middleware"
import isCompleteUser from "../middleware/isCompleteUser.middleware"
import brandsRouter from "./brands.router"
import categoriesRouter from "./categories.router"
import colorsRouter from "./colors.router"
import mercadoPagoRouter from "./mercadoPago.router"
import orderRouter from "./order.router"
import productColorImagesRouter from "./ProductColorImages.router"
import productColorsRouter from "./productColors.router"
import productColorSizesRouter from "./ProductColorSizes.router"
import productsRouter from "./products.router"
import productRecomendationsRouter from "./productsRecomendations.router"
import productsViewRouter from "./productsView.router"
import shopcartRouter from "./shopcart.router"
import sizesRouter from "./sizes.router"
import userAccountRouter from "./userAccount.router"
import userRegisterRouter from "./userRegister.router"
import usersRouter from "./users.router"
import userAdresessRouter from "./userAdresess.router"

const createRouters = (app:Application) => {
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
    app.use("/users/adresess",userAdresessRouter)
    app.use("/mercadopago",isCompleteUser, mercadoPagoRouter)
    app.use("/orders",isCompleteUser,orderRouter)
    app.use("/shopcart",shopcartRouter)
}

export default createRouters