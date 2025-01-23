import express from "express"
import MercadoPagoController from "../controller/mercadoPago.controller"
import verifyOrderPreference from "../middleware/verifyOrderPreference.middleware"

const mercadoPagoRouter = express.Router()

mercadoPagoRouter.get("/checkout/:user_purchase_id",verifyOrderPreference, MercadoPagoController.checkout)

export default mercadoPagoRouter
