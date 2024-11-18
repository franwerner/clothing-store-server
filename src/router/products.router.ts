import express from "express"
import ProductsController from "../controller/products.controller.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const productsRouter = express.Router()

productsRouter.get("/category/:category_id", ProductsController.getProductsPerCategory)
productsRouter.post("/", isAdmin, ProductsController.addProducts)
productsRouter.patch("/", isAdmin, ProductsController.modifyProducts)
productsRouter.delete("/", isAdmin, ProductsController.removeProducts)


export default productsRouter