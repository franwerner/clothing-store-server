import { NextFunction, Request, Response } from "express";
import UsersModel from "../model/users.model.js";
import UserAuthService from "../service/userAuth.service.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import UserRegisterService from "../service/userRegister.service.js";
import UserTokenService from "../service/userToken.service.js";
import emailService from "../service/email/index.js";

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

    static async register(req: Request<any, any, RegisterBody>, res: Response, next: NextFunction) {
        try {
            const { email, fullname, phone, password } = req.body
            const ip = req.ip as string

            const insertID = await UserRegisterService.createAccount({
                ip,
                password,
                email,
                fullname,
                phone,
            })

            const token = await UserTokenService.createToken({
                ip,
                request: "email_confirmation",
                user_fk: insertID
            },
                { type: "hour", value: 1 }
            )

            await emailService.sendVerificationEmail({
                email,
                token
            })

            res.json({
                message: "Usuario ha sido creado con éxito",
                data: {
                    created_id: insertID
                }
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error,
                    { ER_DUP_ENTRY: "El email ya esta registrado." }
                ).response(res)
            } else {
                next()
            }
        }
    }

    static async login(req: Request<any, any, LoginBody>, res: Response, next: NextFunction) {

        try {
            const { email, password } = req.body

            const [user] = await UsersModel.select({ email })

            if (!user) throw new ErrorHandler({ message: "El email no esta asociado a ningun usuario.", status: 422 })

            const compare = await UserAuthService.validatePassword(password, user.password)

            if (!compare) throw new ErrorHandler({ message: "La contraseña ingresada es incorrecta.", status: 422 })

            res.json({
                data: UserAuthService.formatUser(user)
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

    static async registerConfirm(req: Request<any, any, any>, res: Response, next: NextFunction) {
        try {

        } catch (error) {

        }
    }

    static async registerReSendToken(req: Request<any, any, any>, res: Response, next: NextFunction) {
        const idTest = 34
        const emailTest = "ifrank4444@gmail.com"
        try {
            const token = await UserTokenService.createToken({
                ip: req.ip as string,
                request: "email_confirmation",
                user_fk: idTest
            }, {
                type: "hour",
                value: 1
            })

            await emailService.sendVerificationEmail({ email: emailTest, token })

            res.json({
                message : "Re-envio exitoso, revisa tu email."
            })
        } catch (error) {
            console.log(error)
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

}


export default UsersController