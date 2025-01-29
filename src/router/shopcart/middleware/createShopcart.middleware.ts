import { NextFunction, Request, Response } from "express"
import ErrorHandler from "@/utils/errorHandler.utilts"
import ShopcartService from "@/service/shopcart.service"
import errorGlobal from "@/middleware/errorGlobal.middleware"


const createShopcartMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const shopcart = req.session.shopcart
        req.session.shopcart = await ShopcartService.createShopcart(shopcart)
        next()
    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }

}

export default createShopcartMiddleware