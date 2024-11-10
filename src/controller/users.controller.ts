import { NextFunction, Request, Response } from "express";
import UsersModel from "../model/users.model.js";
import UserAuthService from "../service/userAuth.service.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import UserRegisterService from "../service/userRegister.service.js";

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

            const insertID = await UserRegisterService.createAccount({
                ip: req.ip as string,
                password,
                email,
                fullname,
                phone,
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

}


export default UsersController