import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/errorHandler.utilts"

const isUser = (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user
        if (user) {
            next()
        }else {
            new ErrorHandler({
                status : 401,
                message: "La sesión ha expirado, por favor inicia sesión nuevamente.",
            }).response(res)
        }
   
}


export default isUser