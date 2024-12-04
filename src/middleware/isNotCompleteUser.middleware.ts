import { NextFunction, Request, Response } from "express"
import UsersModel from "../model/users.model.js"
import isUser from "./isUser.middleware.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

const response = (res: Response) => {

    new ErrorHandler({
        message: "El email ya está confirmado, no puedes continuar con esta operacion.",
        status: 401
    }).response(res)
}

const isNotCompleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user

    if (!user) return isUser(req, res, next)

    if (user.email_confirmed) return response(res)

    const [u] = await UsersModel.select<"email_confirmed">({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
    const { email_confirmed } = u

    if (!email_confirmed) {
        next()
    } else {
        user.email_confirmed = true
        response(res)
    }

}


export default isNotCompleteUser

