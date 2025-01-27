import { NextFunction, Request } from "express";
import getSessionData from "../helper/getSessionData.helper";
import MercadoPagoService from "../service/mercadoPago.service";
import UserPurchasesService from "../service/userPurchases.service";
import UserPurchaseShippings from "../service/userPurchaseShippings.service";
import ErrorHandler from "../utils/errorHandler.utilts";
import UserPurchaseProductsService from "../service/userPurchaseProducts.service";

class MercadoPagoController {

    static async checkout(
        req: Request,
        res: APP.ResponseTemplate<any, { expired_date: Date }>,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)

            const { user_purchase_id = "" } = req.params

            const transform = await MercadoPagoService.transformProductsToCheckoutItems(user_purchase_id)

            const total = await UserPurchaseProductsService.calculateTotal(user_purchase_id)

            const { init_point, date_of_expiration, id } = await MercadoPagoService.createCheckout({
                items: transform,
                external_reference: user_purchase_id,
                date_of_expiration: res.locals.expired_date,
                shipments: {
                    cost: 15000,
                    free_shipping: total >= 0
                }
            })

            await UserPurchasesService.update({
                user_purchase_id,
                preference_id: id,
            })

            res.json({
                message: "preferencia de pago obtenida exitosamente!",
                data: {
                    init_point,
                    date_of_expiration,
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



export default MercadoPagoController