import express from "express"
import MercadoPagoController from "../controller/mercadoPago.controller"
import validateMercadoPagoWebhook from "../middleware/validateMercadoPagoWebhook.middleware"

const mercadoPagoRouter = express.Router()

mercadoPagoRouter.post("/notification", validateMercadoPagoWebhook, MercadoPagoController.notification)
export default mercadoPagoRouter
