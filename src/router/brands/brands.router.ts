import express from "express"
import BrandsController from "./brands.controller"
import isAdmin from "@/middleware/isAdmin.middleware"

const brandsRouter = express.Router()

brandsRouter.get("/", BrandsController.getBrands)
brandsRouter.post("/", isAdmin, BrandsController.addBrands)
brandsRouter.patch("/", isAdmin, BrandsController.modifyBrands)
brandsRouter.delete("/", isAdmin, BrandsController.removeBrands)

export default brandsRouter

