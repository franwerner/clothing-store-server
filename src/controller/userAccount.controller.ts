import { userSchema, UserSchema } from "clothing-store-shared/schema";
import { NextFunction, Request } from "express";
import tokenSettings from "../constant/tokenSettings.constant.js";
import getSessionData from "../helper/getSessionData.helper.js";
import zodParse from "../helper/zodParse.helper.js";
import emailService from "../service/email/index.js";
import UserAccountService from "../service/userAccount.service.js";
import UserAuthService from "../service/userAuth.service.js";
import UserTokenService from "../service/userToken.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class UserAccountController {

    static async updateInfoAuth(
        req: Request<any, any, { password: string }>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {

        /**
         * Authenticamos que el usuario pueda editar la informacion en caso de que exista una session.
         */
        try {
            const password = req.body.password || ""
            const { email } = getSessionData("user_info", req.session)
            await UserAuthService.authenticar({ email, password })
           
            const edit_authorization = {
                expired_at: Date.now() + 60 * 60 * 1000, //1 Hora,
                isAuthorized: true
            }
            req.session.edit_authorization = edit_authorization
            res.json({
                message: "Contraseña verificada con éxito. Tienes una hora para actualizar tu información antes de que caduque la autorización.",
                data: edit_authorization
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async sendPasswordReset(
        req: Request<any, any, { email: string }>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id, email } = await UserAuthService.findUserByEmail(req.body.email)
            const token = await UserTokenService.createToken({
                ip: req.ip ?? "",
                request: "password_reset_by_email",
                user_fk: user_id
            },
                tokenSettings.password_reset_by_email
            )

            await emailService.sendPasswordReset({
                to: email,
                token
            })
            res.json({
                message: "Solicitud para reestablecer la contraseña enviada, revisa tu bandeja de entrada.",
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async passwordReset(
        req: Request<{ token: string }, any, { password: string }>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const token = req.params.token
            const { user_fk } = await UserTokenService.findActiveToken({ request: "password_reset_by_email", token })
            await UserAccountService.updateInfo({
                user_id: user_fk,
                password: req.body.password
            })
            await UserTokenService.markTokenAsUsed(token)
            res.json({
                message: "Contraseña restablecida correctamente.",
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async updateInfo(
        req: Request<any, any, UserSchema.UpdateInfo>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
        
            const user = getSessionData("user_info", req.session)
            await UserAccountService.updateInfo({
                ...req.body,
                user_id: user.user_id
            })

            const userParse = zodParse(userSchema.formatUser)({ ...user, ...req.body, create_at: new Date(user.create_at || "") })

            req.session.user_info = userParse
            res.json({
                message: "Información actualizada correctamente.",
                data: userParse
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async getLoginUserInfo(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)
            const edit_authorization = req.session.edit_authorization
            const user_info = await UserAccountService.getUserInfo(user_id)
            res.json({
                data: {
                    edit_authorization,
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

export default UserAccountController