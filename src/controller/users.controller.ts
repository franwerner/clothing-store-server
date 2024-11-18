import { NextFunction, Request, Response } from "express";
import UserAuthService from "../service/userAuth.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

interface LoginBody {
    email: string
    password: string
}

class UsersController {

    static async login(
        req: Request<any, any, LoginBody>,
        res: Response,
        next: NextFunction
    ) {

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
        req.session.destroy((err) => {
            if (err) {
                next()
            } else {
                res.json({
                    message: "Deslogeo exitoso."
                })
            }
        })
    }
   
}


export default UsersController