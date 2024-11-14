import { NextFunction, Request, Response } from "express";
import emailService from "../service/email/index.js";
import UserAuthService from "../service/userAuth.service.js";
import UserRegisterService from "../service/userRegister.service.js";
import UserTokenService from "../service/userToken.service.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import IPservice from "../service/ip.service.js";

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
            
            const ip = IPservice.isValidIP(req.body)

            const insertID = await UserRegisterService.main({
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
                { type: "hour", value: 24 }
            )

            await emailService.sendVerificationEmail({
                email,
                token
            })

            res.json({
                message: "Cuena creada creado con éxito, por favor confirma el email registrado.",
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

            const user = await UserAuthService.findUserByEmail(email)

            await UserAuthService.verifyPassword(password, user.password)

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

    static async registerConfirm(req: Request<{ token: string }, any, any>, res: Response, next: NextFunction) {
        try {

            const { token } = req.params
            
            const userID = await UserTokenService.useToken(token)

            await UserRegisterService.completeRegister(userID)

            res.json({
                message: "Registro confirmado con exito!"
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

    static async registerReSendToken(req: Request<any, any, any>, res: Response, next: NextFunction) {
        const idTest = 37
        const emailTest = "ifrank4444@gmail.com"
        //Aca verificamos que en la session no tenga el email verificado para que no puedo re-enviar tokens
        try {

            const ip = IPservice.isValidIP(req.body)
            
            const token = await UserTokenService.createToken({
                ip ,
                request: "email_confirmation",
                user_fk: idTest
            }, {
                type: "hour",
                value: 24
            })

            await emailService.sendVerificationEmail({ email: emailTest, token })

            res.json({
                message: "Re-envio exitoso, revisa tu email."
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

}


export default UsersController