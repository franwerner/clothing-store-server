import { userSchema, UserSchema } from "clothing-store-shared/schema";
import { NextFunction, Request } from "express";
import tokenSettings from "../constant/tokenSettings.constant.js";
import getSessionData from "../helper/getSessionData.helper.js";
import zodParse from "../helper/zodParse.helper.js";
import emailService from "../service/email/index.js";
import UserInfoService from "../service/userInfo.service.js";
import UserAuthService from "../service/userAuth.service.js";
import UserTokenService from "../service/userToken.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class UserInfoController {

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

            const edit_expiration = UserInfoService.createEditExpiration()

            req.session.edit_expiration = edit_expiration
            res.json({
                message: "Contraseña verificada con éxito.",
                data: edit_expiration
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
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const token = req.params.token
            const { user_fk } = await UserTokenService.findActiveToken({ request: "password_reset_by_email", token })
            await UserInfoService.updateInfo({
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
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            const user = getSessionData("user_info", req.session)
            await UserInfoService.updateInfo({
                ...req.body,
                user_id: user.user_id
            })
            const userParse = zodParse(userSchema.formatUser)({ ...user, ...req.body })
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


}

export default UserInfoController