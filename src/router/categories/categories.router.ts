import express from "express";
import isAdmin from "@/middleware/isAdmin.middleware.js";
import CategoriesController from "./categories.controller";

const categoriesRouter = express.Router()

categoriesRouter.get("/brand/:brand_id", CategoriesController.getByBrand)
categoriesRouter.post("/", isAdmin, CategoriesController.addCategories)
categoriesRouter.patch("/", isAdmin, CategoriesController.modifyCategories)
categoriesRouter.delete("/", isAdmin, CategoriesController.removeCategories)

export default categoriesRouter