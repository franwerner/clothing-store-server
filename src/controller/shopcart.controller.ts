import { NextFunction, Request } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";
import getSessionData from "../helper/getSessionData.helper";
import ShopcartService from "../service/shopcart.service";

class ShopcartController {
    static async getShopcart(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = getSessionData("shopcart", req.session)
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async addProducts(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const shopcart = getSessionData("shopcart", req.session)
            const products = await ShopcartService.addProducts(shopcart.products, req.body.products)
            shopcart.products = products
            res.json({
                message: "Productos agregados al carrito correctamente.",
                data: products
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async updateProductQuantity(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const product = req.body.product
            const shopcart = getSessionData("shopcart", req.session)
            shopcart.products = await ShopcartService.updateQuantity(shopcart.products, product)
            res.json({
                message: "Cantidad del producto cambiada exitosamente.",
                data: shopcart.products.find(i => i.id === product.id)
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async removeProduct(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const shopcart = getSessionData("shopcart", req.session)
            shopcart.products = ShopcartService.removeProduct(shopcart.products, req.body.id)
            res.json({
                message: "Producto borrado del carrito exitosamente."
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
}

export default ShopcartController