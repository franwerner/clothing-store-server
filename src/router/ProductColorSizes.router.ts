import express from "express"
import ProductColorSizesController from "../controller/productColorSizes.controller.js"
const productColorSizesRouter = express.Router()


productColorSizesRouter.post("/", ProductColorSizesController.setProductColorSizes)
productColorSizesRouter.delete("/", ProductColorSizesController.removeProductColorSizes)
productColorSizesRouter.patch("/", ProductColorSizesController.modifyProductColorSizes)
productColorSizesRouter.patch("/updateByProductColor",ProductColorSizesController.updateByProductColor)

export default productColorSizesRouter