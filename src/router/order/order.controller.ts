import { NextFunction, Request } from "express";
import getSessionData from "@/helper/getSessionData.helper";
import OrdersService from "@/service/orders.service";
import ErrorHandler from "@/utils/errorHandler.utilts";
import UserPurchasesService from "@/service/users/purchases/userPurchases.service";
class OrderController {

    static async createOrder(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const user = getSessionData("user_info", req.session)
            const shopcart = getSessionData("shopcart", req.session)
            const { order_address } = req.body
            const { products, expire_at, shipping } = shopcart
            const expired_date = new Date(expire_at) //Llega como un string desde la session.
            const { date_of_expiration, init_point } = await OrdersService.createOrder({
                order: {
                    user_fk: user.user_id,
                    expire_at: expired_date,
                    is_guest: false,
                },
                order_products: products,
                order_shipping: shipping,
                order_address
            })
            req.session.shopcart = undefined
            res.status(201).json({
                data: {
                    init_point,
                    date_of_expiration,
                },
                message: "Orden creada exitosamente."
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async createOrderGuest(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const shopcart = getSessionData("shopcart", req.session)
            const { products, expire_at, shipping } = shopcart
            const { order_address, order_guest } = req.body
            const expired_date = new Date(expire_at)
            const { date_of_expiration, init_point } = await OrdersService.createOrder({
                order: {
                    user_fk: null,
                    expire_at: expired_date,
                    is_guest: true,
                },
                order_products: products,
                order_shipping: shipping,
                order_address,
                order_guest
            })
            req.session.shopcart = undefined
            res.status(201).json({
                data: {
                    init_point,
                    date_of_expiration,
                },
                message: "Orden creada exitosamente."
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
        req: Request<any, any, any>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_purchase_id = "" } = req.params
            const { user_id } = getSessionData("user_info", req.session)
            const data = await UserPurchasesService.getByUser({
                user_fk: user_id,
                user_purchase_id: user_purchase_id
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
}

export default OrderController