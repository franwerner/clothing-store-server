import { NextFunction, Request } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";

const isExitsShopcart = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {
    const shopcart = req.session?.shopcart
    if (!shopcart || shopcart.products.length === 0) {
        new ErrorHandler({
            status: 404,
            code: "shopcart_not_found",
            message: "No hay un carrito de compras creado",
        }).response(res)
    }
    else if (shopcart.expired_at < Date.now()) {
        req.session.shopcart = undefined
        new ErrorHandler({
            status: 404,
            code: "expired_shopcart",
            message: "El carrito de compras se encuentra expirado.",
        }).response(res)
    }
    else {
        next()
    }
}

export default isExitsShopcart