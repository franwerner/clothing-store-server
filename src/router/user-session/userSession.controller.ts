import { NextFunction, Request } from "express";
import getSessionData from "@/helper/getSessionData.helper.js";
import UserAuthService from "@/service/users/userAuth.service.js";
import UserInfoService from "@/service/users/userInfo.service.js";
import ErrorHandler from "@/utils/errorHandler.utilts.js";

class UserSessionController {
    static async login(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body
            const user = await UserAuthService.authenticar({ email, password })
            const session = req.session
            session.user_info = user
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
    static logout(
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

    static async getUserSession(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)
            const edit_expiration = req.session.edit_expiration
            const user_info = await UserInfoService.getUserInfo(user_id)
            req.session.user_info = user_info
            res.json({
                data: {
                    edit_expiration,
                    user_info
                }
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

}


export default UserSessionController