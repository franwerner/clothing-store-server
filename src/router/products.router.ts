import express from "express"
import ProductsController from "../controller/products.controller.js"


const productsRouter = express.Router()

productsRouter.post("/", ProductsController.setProducts)
productsRouter.patch("/", ProductsController.modifyProducts)
productsRouter.get("/category/:category_id", ProductsController.getProductsPerCategory)
productsRouter.delete("/",ProductsController.removeProducts)


export default productsRouter