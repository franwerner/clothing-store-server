import { NextFunction, Request, Response } from "express"
import ErrorHandler from "@/utils/errorHandler.utilts"

const isGuest = (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user_info
    if (!user) {
        next()
    } else {
        new ErrorHandler({
            status: 401,
            message: "No eres un usuario invitado para poder realizar este tipo de órdenes.",
            code: "user_not_invited"
        }).response(res)
    }
}

export default isGuest