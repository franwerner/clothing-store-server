import express from "express"
import MercadoPagoController from "../controller/mercadoPago.controller"
import verifyOrderPreference from "../middleware/verifyOrderPreference.middleware"

const mercadoPagoRouter = express.Router()

mercadoPagoRouter.get("/checkout",verifyOrderPreference, MercadoPagoController.checkout)

export default mercadoPagoRouter
