import express from "express"
import SizeController from "../controller/sizes.controller.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const sizesRouter = express.Router()

sizesRouter.get("/",SizeController.getSizes)
sizesRouter.post("/",isAdmin,SizeController.addSizes)
sizesRouter.patch("/",isAdmin,SizeController.modifySizes)
sizesRouter.delete("/",isAdmin,SizeController.removeSizes)

export default sizesRouter