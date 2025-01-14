import { NextFunction, Request, Response } from "express"
import UsersModel from "../model/users.model.js"
import isUser from "./isUser.middleware.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

const errorHandler = new ErrorHandler({
    message: "El email ya está confirmado, no puedes continuar con esta operacion.",
    code: "email_already_confirmed",
    status: 401
})

const isNotCompleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user_info

    if (!user) return isUser(req, res, next)
    else if (user.email_confirmed) return errorHandler.response(res)

    const [u] = await UsersModel.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
    const { email_confirmed } = u

    if (!email_confirmed) {
        next()
    } else {
        user.email_confirmed = true
        errorHandler.response(res)
    }

}


export default isNotCompleteUser

