import { NextFunction, Request } from "express"
import UsersModel from "../model/users.model"
import isUser from "./isUser.middleware"

/**
 * Este middleware es para aquellos usuarios que cumples con todos los requisitos para la interaccion con el sistema.
 */
const isCompleteUser = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {

    const user = req.session.user

    if (!user) return isUser(req, res, next)

    if (user.email_confirmed) {
        return next()
    }

    const [u] = await UsersModel.select<"email_confirmed">({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
    const { email_confirmed } = u

    if (email_confirmed) {
        user.email_confirmed = true
        next()
    } else {
        res.status(401).json({
            message: "Por favor, confirma tu dirección de correo electrónico para continuar con esta operación."
        })
    }


}

export default isCompleteUser  