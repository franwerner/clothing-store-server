import { NextFunction, Request } from "express";
import MercadoPagoService from "../service/mercadoPago.service";
import ErrorHandler from "../utils/errorHandler.utilts";
import OrdersService from "../service/orders.service";

class OrderController {

    static async createOrder(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_purchase_id } = await OrdersService.createOrder(req.body)
            const transform = await MercadoPagoService.transformProductsToCheckoutItems(user_purchase_id)
            const { init_point } = await MercadoPagoService.createPreferenceOrder({
                items: transform,
                user_purchase_id : user_purchase_id
            })
            res.json({
                data : {
                    checkout_url: init_point
                },
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }
}


export default OrderController