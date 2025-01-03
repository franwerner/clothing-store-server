import express from "express"
import ProductColorsController from "../controller/productColors.controller.js"

const productColorsRouter = express.Router()

productColorsRouter.post("/", ProductColorsController.setProductColors)
productColorsRouter.delete("/", ProductColorsController.removeProductColors)
productColorsRouter.patch("/", ProductColorsController.modifyProductColors)

export default productColorsRouter