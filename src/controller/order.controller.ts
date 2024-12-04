import { NextFunction, Request } from "express";
import storeConfig from "../constant/storeConfig.contant";
import getSessionData from "../helper/getSessionData.helper";
import MercadoPagoService from "../service/mercadoPago.service";
import OrdersService from "../service/orders.service";
import UserPurchaseProductService from "../service/userPurchaseProducts.service";
import "../service/userPurchaseShippings.service";
import UserPurchaseShippings from "../service/userPurchaseShippings.service";
import { default as userPurchasesService, default as UserPurchasesService } from "../service/userPurchases.service";
import ErrorHandler from "../utils/errorHandler.utilts";
import getAdjustedUTCDate from "../utils/getAdjustedUTCDate.utils";
class OrderController {

    static async createOrder(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const user = getSessionData("user", req.session)
            const { order = {}, order_products = [] } = req.body
            const expire_date = getAdjustedUTCDate(+3)
            const { user_purchase_id } = await OrdersService.create({
                order: {
                    ...order,
                    user_fk: user.user_id,
                    expire_at: expire_date
                },
                order_products,
            })

            const transform = await MercadoPagoService.transformProductsToCheckoutItems({
                user_fk: user.user_id,
                user_purchase_fk: user_purchase_id
            })

            const total = await UserPurchaseShippings.calculateFreeShipping({
                user_fk: user.user_id,
                user_purchase_fk: user_purchase_id
            })

            const data = await MercadoPagoService.createCheckout({
                items: transform,
                external_reference: user_purchase_id,
                date_of_expiration: expire_date,
                shipments: {
                    cost: 15000,
                    free_shipping: total >= storeConfig.minFreeShipping
                }

            })

            await UserPurchasesService.updateForUser({
                user_purchase_id,
                preference_id: data.id,
                user_fk: user.user_id
            })

            const { init_point, date_of_expiration } = data

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

    static async getOrder(
        req: Request<any, any, any, { purchase_id: string }>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { purchase_id = "" } = req.query
            const { user_id } = getSessionData("user", req.session)
            const data = await userPurchasesService.getForUser({
                user_fk: user_id,
                user_purchase_id: purchase_id
            })
            res.json({
                data,
                
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async getOrderDetails(
        req: Request<any, any, any, { purchase_id: string }>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user", req.session)
            const { purchase_id = "" } = req.query
            const data = await UserPurchaseProductService.getForUser({ user_purchase_fk: purchase_id, user_fk: user_id })
            res.json({
                data,
                
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