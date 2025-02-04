import express from "express"
import isAdmin from "@/middleware/isAdmin.middleware.js"
import ProductsController from "./products.controller"

const productsRouter = express.Router()

productsRouter.get("/category/:category_id", ProductsController.getByCategory)
productsRouter.post("/", isAdmin, ProductsController.addProducts)
productsRouter.patch("/", isAdmin, ProductsController.modifyProducts)
productsRouter.delete("/", isAdmin, ProductsController.removeProducts)
productsRouter.patch("/updateByCategory",isAdmin,ProductsController.updateByCategory)


export default productsRouter