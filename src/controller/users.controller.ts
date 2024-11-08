import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import UsersModel from "../model/users.model.js";
import UserAuthService from "../service/userAuthService.service.js";


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


            const hash = await UserAuthService.createPassword(password)

            const data = await UsersModel.insert({
                email,
                fullname,
                phone,
                password: hash,
                ip: req.ip as string //Verificar el tema de la IP.
            })

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
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
                data: user
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error.code).response(res)
            } else {
                next()
            }
        }
    }

}


export default UsersController