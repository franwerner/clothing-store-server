import express from "express"
import ProductsController from "../controller/productsPreview.controller.js"

const productsPreview = express.Router()

productsPreview.get("/", ProductsController.getProduct)
productsPreview.get("/:brand",ProductsController.getProduct)
productsPreview.get("/:brand/:category",ProductsController.getProduct)

export default productsPreview