import express from "express"
import ProductsViewController from "../controller/productsView.controller.js"

const productsViewRouter = express.Router()

productsViewRouter.get("/preview", ProductsViewController.getProductsPreview)
productsViewRouter.get("/preview/:brand_id", ProductsViewController.getProductsPreview)
productsViewRouter.get("/preview/:brand_id/:category_id", ProductsViewController.getProductsPreview)
productsViewRouter.get("/fullview/:product_id", ProductsViewController.getProductFullView)

export default productsViewRouter