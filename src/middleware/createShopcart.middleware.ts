import { NextFunction, Request, Response } from "express"
import ShopcartService from "../service/shopcart.service"

const createShopcartMiddleware = (
    req: Request,
    _: Response,
    next: NextFunction
) => {

    const shopcart = req.session.shopcart
    
    if (!shopcart || Date.now() > shopcart.expired_at){
        req.session.shopcart = ShopcartService.createShopcart(shopcart)
    }

    next()

}

export default createShopcartMiddleware