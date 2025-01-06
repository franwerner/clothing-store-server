import { NextFunction, Request } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";

const isExitsShopcart = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {
    const shopcart = req.session?.shopcart
    if (!shopcart) {
        new ErrorHandler({
            status: 404,
            code: "unavailable_shopcart",
            message: "No hay un carrito de compras creado",
        }).response(res)
    }
    else if (shopcart.expired_at  < Date.now()) {
        shopcart.products = []
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