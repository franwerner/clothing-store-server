import express from "express"
import SizeController from "../controller/sizes.controller.js"

const sizesRouter = express.Router()

sizesRouter.get("/",SizeController.getSizes)
sizesRouter.post("/",SizeController.setSizes)
sizesRouter.patch("/",SizeController.modifySizes)
sizesRouter.delete("/",SizeController.removeSizes)

export default sizesRouter