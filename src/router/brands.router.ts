import express from "express"
import BrandsController from "../controller/brands.controller.js"


const brandsRouter = express.Router()

brandsRouter.get("/", BrandsController.getBrands)
brandsRouter.post("/",BrandsController.setBrands)
brandsRouter.patch("/",BrandsController.modifyBrands)
brandsRouter.delete("/",BrandsController.removeBrands)

export default brandsRouter