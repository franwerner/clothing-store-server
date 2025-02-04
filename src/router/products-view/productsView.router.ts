import express from "express"
import ProductsViewController from "./productsView.controller"

const productsViewRouter = express.Router()

productsViewRouter.get("/preview/colors",ProductsViewController.getProductColorsPreview)
productsViewRouter.get("/preview/sizes",ProductsViewController.getProductSizesPreview)
productsViewRouter.get("/preview", ProductsViewController.getProductsPreview)
productsViewRouter.get("/preview/:brand", ProductsViewController.getProductsPreview)
productsViewRouter.get("/preview/:brand/:category", ProductsViewController.getProductsPreview)
productsViewRouter.get("/fullview/:brand/:category/:product", ProductsViewController.getProductFullView)

export default productsViewRouter