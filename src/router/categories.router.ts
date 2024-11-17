import express from "express";
import CategoriesController from "../controller/categories.controller.js";
import isAdmin from "../middleware/isAdmin.middleware.js";

const categoriesRouter = express.Router()

categoriesRouter.get("/brand/:brand_id", CategoriesController.getCategoriesPerBrand)
categoriesRouter.post("/", isAdmin, CategoriesController.addCategories)
categoriesRouter.patch("/", isAdmin, CategoriesController.modifyCategories)
categoriesRouter.delete("/", isAdmin, CategoriesController.removeCategories)

export default categoriesRouter