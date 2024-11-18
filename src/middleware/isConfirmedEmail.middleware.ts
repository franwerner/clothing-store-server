import { NextFunction, Request, Response } from "express"
import UsersModel from "../model/users.model.js"

const response = (res: Response) => {
    res.status(400).json({
        message: "El email ya está confirmado. No es necesario reenviar el token."
    })
}
//Siempre se debe ejecutar en conjunto de un middleware que verifique si existe una session.
const isConfirmedEmail = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user

    if (user && user.email_confirmed) {
        response(res)
    } else if (user) {
        const [u] = await UsersModel.select<"email_confirmed">({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"))
        const { email_confirmed } = u
        if (email_confirmed) {
            user.email_confirmed = true
            response(res)
        } else {
            next()
        }
    }

}


export default isConfirmedEmail

