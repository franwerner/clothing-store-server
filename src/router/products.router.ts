import express from "express"
import ProductsController from "../controller/products.controller.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const productsRouter = express.Router()

productsRouter.get("/category/:category_id", ProductsController.getByCategory)
productsRouter.post("/", isAdmin, ProductsController.addProducts)
productsRouter.patch("/", isAdmin, ProductsController.modifyProducts)
productsRouter.delete("/", isAdmin, ProductsController.removeProducts)
productsRouter.patch("/updateByCategory",isAdmin,ProductsController.updateByCategory)


export default productsRouter