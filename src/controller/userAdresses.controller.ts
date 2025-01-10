import { NextFunction, Request } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";
import UserAdresessService from "../service/userAdresess.service";
import getSessionData from "../helper/getSessionData.helper";

class UserAdresessController {

    static async getAdress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)
           const adress =  await UserAdresessService.getAdress(user_id)
            res.json({
                message: "Direccion creada exitosamente!",
                data : adress
            })
        } catch (error) {
            if (error instanceof ErrorHandler) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async createAdress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            await UserAdresessService.createAdress(req.body)

            res.json({
                message: "Direccion creada exitosamente!"
            })

        } catch (error) {
            if (error instanceof ErrorHandler) {
                error.response(res)
            } else {
                next()
            }
        }

    }

    static async updateAdress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            await UserAdresessService.updateAdress(req.body)

            res.json({
                message: "Direccion editada exitosamente!"
            })

        } catch (error) {
            if (error instanceof ErrorHandler) {
                error.response(res)
            } else {
                next()
            }
        }
    }

}

export default UserAdresessController