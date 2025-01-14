import { NextFunction, Request } from "express";
import UserAuthService from "../service/userAuth.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class UsersController {
    static async login(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body
            const user = await UserAuthService.authenticar({ email, password })
            req.session.user_info = user
            res.json({
                data: user,
                message: "¡Inicio de sesión exitoso! Bienvenido de nuevo."
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }
    static  logout(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        req.session.destroy((err) => {
            if (err) {
                next()
            } else {
                res.json({
                    message: "¡Cierre de sesión exitoso! Hasta pronto."
                })
            }
        })
    }

}


export default UsersController