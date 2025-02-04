import { Router } from "express"
import isExitsShopcart from "@/middleware/isExitsShopcart.middleware"
import createShopcartMiddleware from "./middleware/createShopcart.middleware"
import ShopcartController from "./shopcart.controller"

const shopcartRouter = Router()

shopcartRouter.get("/", isExitsShopcart, ShopcartController.getShopcart)
shopcartRouter.post("/", createShopcartMiddleware, ShopcartController.addProducts)
shopcartRouter.delete("/", isExitsShopcart, ShopcartController.removeProduct)
shopcartRouter.patch("/", isExitsShopcart, ShopcartController.updateProductQuantity)

export default shopcartRouter