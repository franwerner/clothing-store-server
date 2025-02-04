import { NextFunction, Request } from "express"
import isUser from "./isUser.middleware"
import ErrorHandler from "../utils/errorHandler.utilts"
import errorGlobal from "./errorGlobal.middleware"
import UsersModel from "@/model/users/users.model"


const isCompleteUser = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {

    try {
        const user = req.session.user_info
        if (!user) return isUser(req, res, next)
        else if (user.email_confirmed) return next()

        const [{ email_confirmed }] = await UsersModel.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))

        if (email_confirmed) {
            user.email_confirmed = true
            next()
        } else {
            throw new ErrorHandler({
                status: 403,
                message: "Por favor, confirma tu dirección de correo electrónico para continuar con esta operación.",
                code: "session_not_complete"
            })
        }
    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }
}

export default isCompleteUser  