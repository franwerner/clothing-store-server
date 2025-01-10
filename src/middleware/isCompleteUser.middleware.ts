import { NextFunction, Request } from "express"
import UsersModel from "../model/users.model"
import isUser from "./isUser.middleware"
import ErrorHandler from "../utils/errorHandler.utilts"

/**
 * Este middleware es para aquellos usuarios que cumples con todos los requisitos para la interaccion con el sistema.
 */
const isCompleteUser = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {

    const user = req.session.user_info

    if (!user) return isUser(req, res, next)

    if (user.email_confirmed) {
        return next()
    }

    const [u] = await UsersModel.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
    const { email_confirmed } = u

    if (email_confirmed) {
        user.email_confirmed = true
        next()
    } else {
        new ErrorHandler({
            status: 401,
            message: "Por favor, confirma tu dirección de correo electrónico para continuar con esta operación.",
            code: "session_unauthorized"
        }).response(res)
    }


}

export default isCompleteUser  