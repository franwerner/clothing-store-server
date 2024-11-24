import express from "express"
import BrandsController from "../controller/brands.controller.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const brandsRouter = express.Router()

brandsRouter.get("/", BrandsController.getBrands)
brandsRouter.post("/", isAdmin, BrandsController.addBrands)
brandsRouter.patch("/", isAdmin, BrandsController.modifyBrands)
brandsRouter.delete("/", isAdmin, BrandsController.removeBrands)

export default brandsRouter

