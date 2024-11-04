import express from "express"
import ProductsManagerController from "../controller/productsManager.controller.js"


const productsManager = express.Router()

productsManager.post("/", ProductsManagerController.setProduct)
productsManager.patch("/",ProductsManagerController.modifyProduct)
productsManager.get("/:product_id",ProductsManagerController.getProduct)
productsManager.get("/",ProductsManagerController.getAllProducts)

export default productsManager