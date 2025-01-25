import { NextFunction, Request, Response } from "express"
import ShopcartService from "../service/shopcart.service"

const createShopcartMiddleware = (
    req: Request,
    _: Response,
    next: NextFunction
) => {

    const shopcart = req.session.shopcart
    req.session.shopcart = ShopcartService.createShopcart(shopcart)
    next()

}

export default createShopcartMiddleware