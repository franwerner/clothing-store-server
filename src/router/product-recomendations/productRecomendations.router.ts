import express from "express"
import ProductRecomendationsController from "./productRecomendations.controller"

const productRecomendationsRouter = express.Router()

productRecomendationsRouter.get("/random",ProductRecomendationsController.getRandomProductRecomendation)

export default productRecomendationsRouter