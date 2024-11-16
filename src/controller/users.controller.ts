import { NextFunction, Request, Response } from "express";
import getSessionData from "../helper/getSessionData.helper.js";
import emailService from "../service/email/index.js";
import IPservice from "../service/ip.service.js";
import UserAuthService from "../service/userAuth.service.js";
import UserRegisterService from "../service/userRegister.service.js";
import UserTokenService from "../service/userToken.service.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

interface LoginBody {
    email: string
    password: string
}
interface RegisterBody {
    fullname: string
    phone?: string
    email: string
    password: string
}

class UsersController {

    static async login(req: Request<any, any, LoginBody>, res: Response, next: NextFunction) {

        try {
            const { email, password } = req.body

            const user = await UserAuthService.main({ email, password })

            req.session.user = user

            res.json({
                data: user
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    next()
                } else {
                    res.json({
                        message: "Deslogeo exitoso!"
                    })
                }
            })
        } catch (error) {
            next()
        }
    }

    static async register(req: Request<any, any, RegisterBody>, res: Response, next: NextFunction) {
        try {
            const { email, fullname, phone, password } = req.body

            const ip = IPservice.isValidIP(req.ip)

            const account = await UserRegisterService.main({
                ip,
                password,
                email,
                fullname,
                phone,
            })

            const token = await UserTokenService.createToken({
                ip,
                request: "register_confirm",
                user_fk: account.user_id
            },
                { timeUnit: "hour", timeValue: 24, maxTokens: 10 }
            )

            await emailService.sendVerification({
                email,
                token
            })

            req.session.user = UserAuthService.formatUser(account)


            res.json({
                message: "Cuenta creada creado con éxito, por favor confirma el email registrado.",
                data: {
                    created_id: account.user_id
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

    static async registerConfirm(req: Request<{ token: string }, any, any>, res: Response, next: NextFunction) {
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

    static async registerReSendToken(req: Request<any, any, any>, res: Response, next: NextFunction) {
        try {
            const { user_id, email } = getSessionData("user", req.session)

            const ip = IPservice.isValidIP(req.ip)

            const token = await UserTokenService.createToken({
                ip,
                request: "register_confirm",
                user_fk: user_id
            }, { timeUnit: "hour", timeValue: 24, maxTokens: 10 })

            await emailService.sendVerification({ email, token })

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

}


export default UsersController