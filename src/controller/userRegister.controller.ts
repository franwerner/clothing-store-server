import { NextFunction, Request } from "express"
import getSessionData from "../helper/getSessionData.helper.js"
import { DatabaseKeySchema } from "clothing-store-shared/schema"
import emailService from "../service/email/index.js"
import UserRegisterService from "../service/userRegister.service.js"
import UserTokenService from "../service/userToken.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import tokenSettings from "../constant/tokenSettings.constant.js"

const handlerRegisterToken = async ({ ip, email, user_fk }: { ip: any, email: string, user_fk: DatabaseKeySchema }) => {
    const token = await UserTokenService.createToken({
        ip: ip,
        request: "email_confirm",
        user_fk: user_fk
    }, tokenSettings.email_confirm)

    await emailService.sendEmailConfirm({ to: email, token })
}
class UserRegisterController {

    static async register(
        req: Request,
        res: APP.ResponseTemplate<{ created_id: DatabaseKeySchema }>,
        next: NextFunction
    ) {
        try {
            const account = await UserRegisterService.registerAccount({
                ...req.body,
                ip: req.ip
            })

            req.session.user_info = account

            await handlerRegisterToken({
                email: account.email,
                user_fk: account.user_id,
                ip: req.ip,
            })
            res.json({
                message: "Cuenta creada con éxito. Te hemos enviado un correo para confirmar tu correo electronico.",
                data: account
            })
        } catch (error) {
            console.log(error)
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async sendRegisterToken(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id, email } = getSessionData("user_info", req.session)
            await handlerRegisterToken({
                ip: req.ip,
                email,
                user_fk: user_id
            })
            res.json({
                message: "Re-envio exitoso, revisa tu bandeja de entrada.",
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

    static async confirmRegistration(
        req: Request<{ token: string }, any, any>,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { token } = req.params
            const userID = await UserTokenService.useToken({ request: "email_confirm", token })
            await UserRegisterService.completeRegister(userID)
            if (req.session.user_info) {
                req.session.user_info.email_confirmed = true
            }
            res.json({
                message: "Registro confirmado con exito!",
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