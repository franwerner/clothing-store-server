import express from "express";
import CategoriesController from "../controller/categories.controller.js";

const categoriesRouter = express.Router()

categoriesRouter.get("/brand/:brand_id", CategoriesController.getCategoriesPerBrand)
categoriesRouter.post("/", CategoriesController.setCategories)
categoriesRouter.patch("/", CategoriesController.modifyCategories)
categoriesRouter.delete("/",CategoriesController.removeCategories)

export default categoriesRouter