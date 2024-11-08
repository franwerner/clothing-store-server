import express from "express"
import ProductColorImagesController from "../controller/productColorImages.controller.js"

const productColorImagesRouter = express.Router()

productColorImagesRouter.post("/", ProductColorImagesController.setProductColorImages)
productColorImagesRouter.delete("/", ProductColorImagesController.removeProductColorImages)
productColorImagesRouter.patch("/", ProductColorImagesController.modifyProductColorImages)


export default productColorImagesRouter