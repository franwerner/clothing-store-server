import express from "express"
import ProductsRecomendationsController from "../controller/productsRecomendations.controller.js"

const productRecomendationsRouter = express.Router()

productRecomendationsRouter.get("/random",ProductsRecomendationsController.getRandomProductRecomendation)

export default productRecomendationsRouter