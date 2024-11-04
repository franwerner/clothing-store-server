import express from "express"
import BrandsManagerController from "../controller/brandsManager.controller.js"

const brandsManager = express.Router()

brandsManager.get("/", BrandsManagerController.getBrands)
brandsManager.get("/:product_brand_id", BrandsManagerController.getBrand)
brandsManager.post("/",BrandsManagerController.setBrand)

export default brandsManager