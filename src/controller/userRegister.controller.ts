import { NextFunction, Request } from "express"
import getSessionData from "../helper/getSessionData.helper.js"
import { DatabaseKeySchema } from "../schema/databaseKey.schema.js"
import emailService from "../service/email/index.js"
import UserRegisterService from "../service/userRegister.service.js"
import UserTokenService from "../service/userToken.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import tokenSettings from "../constant/tokenSettings.constant.js"

class UserRegisterController {
    static async registerReSendToken(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id, email } = getSessionData("user", req.session)

            const token = await UserTokenService.createToken({
                ip: req.ip || "",
                request: "register_confirm",
                user_fk: user_id
            }, tokenSettings.register_confirm)

            await emailService.sendRegisterConfirm({ email, token })

            res.json({
                message: "Re-envio exitoso, revisa tu bandeja de entrada."
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async registerConfirm(
        req: Request<{ token: string }, any, any>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            const { token } = req.params

            const userID = await UserTokenService.useToken(token)

            await UserRegisterService.completeRegister(userID)

            if (req.session.user) {
                req.session.user.email_confirmed = true
            }

            res.json({
                message: "Registro confirmado con exito!"
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async register(
        req: Request,
        res: APP.ResponseTemplate<{ created_id: DatabaseKeySchema }>,
        next: NextFunction
    ) {
        try {

            const account = await UserRegisterService.main({
                ...req.body,
                ip: req.ip
            })

            const token = await UserTokenService.createToken({
                ip: account.ip,
                request: "register_confirm",
                user_fk: account.user_id,
            },
                tokenSettings.register_confirm
            )

            await emailService.sendRegisterConfirm({
                email: account.email,
                token
            })

            req.session.user = account


            res.json({
                message: "Cuenta creada creado con éxito, por favor confirma el email registrado.",
                data: {
                    created_id: account.user_id
                }
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
}

export default UserRegisterController