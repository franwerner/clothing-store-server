import { NextFunction, Request } from "express";
import ErrorHandler from "@/utils/errorHandler.utilts";
import UserAddresessService from "@/service/users/userAddresess.service";
import getSessionData from "@/helper/getSessionData.helper";

class UserAddresessController {

    static async getAddress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)
            const address = await UserAddresessService.getAddress(user_id)
            res.json({
                data: address
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

    static async createAddress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { user_id } = getSessionData("user_info", req.session)
            const data = await UserAddresessService.createAddress({
                ...req.body,
                user_fk: user_id
            })

            res.json({
                message: "Direccion creada exitosamente!",
                data
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

    static async updateAddress(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            const { user_id } = getSessionData("user_info", req.session)
            const data = await UserAddresessService.updateAddress({
                ...req.body,
                user_fk: user_id
            })

            res.json({
                message: "Direccion editada exitosamente!",
                data
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

export default UserAddresessController