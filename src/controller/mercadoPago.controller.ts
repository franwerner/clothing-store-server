import { NextFunction, Request } from "express";
import getSessionData from "../helper/getSessionData.helper";
import MercadoPagoService from "../service/mercadoPago.service";
import UserPurchasesService from "../service/userPurchases.service";
import UserPurchaseShippings from "../service/userPurchaseShippings.service";
import ErrorHandler from "../utils/errorHandler.utilts";
import { storeConfig } from "../constant/storeConfig.contant";

class MercadoPagoController {

    static async checkout(
        req: Request<any, any, any, { user_purchase_id: string }>,
        res: APP.ResponseTemplate<any,{expired_date : Date}>,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user", req.session)

            const { user_purchase_id = "" } = req.query

            const transform = await MercadoPagoService.transformProductsToCheckoutItems({
                user_fk: user_id,
                user_purchase_fk: user_purchase_id
            })

            const total = await UserPurchaseShippings.calculateFreeShipping({
                user_fk : user_id,
                user_purchase_fk : user_purchase_id
            })
            
            const { init_point, date_of_expiration, id } = await MercadoPagoService.createCheckout({
                items: transform,
                external_reference: user_purchase_id,
                date_of_expiration : res.locals.expired_date,
                shipments : {
                    cost : 15000,
                    free_shipping : total >= storeConfig.minFreeShipping
                }
            })

            await UserPurchasesService.updateForUser({
                user_purchase_id,
                preference_id: id,
                user_fk: user_id
            })

            res.status(201).json({
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