import { NextFunction, Request, Response } from "express"
import UsersModel from "../model/users.model.js"
import isUser from "./isUser.middleware.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import errorGlobal from "./errorGlobal.middleware.js"

const errorHandler = new ErrorHandler({
    message: "El email ya está confirmado, no puedes continuar con esta operacion.",
    code: "email_already_confirmed",
    status: 403
})

const isNotCompleteUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.session.user_info
        if (!user) return isUser(req, res, next)
        else if (user.email_confirmed) throw errorHandler
        const [{ email_confirmed }] = await UsersModel.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
        if (!email_confirmed) {
            next()
        } else {
            user.email_confirmed = true
            throw errorHandler
        }
    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }

}


export default isNotCompleteUser

