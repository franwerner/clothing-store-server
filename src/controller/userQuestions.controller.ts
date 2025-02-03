import getSessionData from "@/helper/getSessionData.helper";
import UserQuestionsService from "@/service/userQuestions.service";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { NextFunction, Request } from "express";

class UserQuestionsController {
    static async create(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const user = getSessionData("user_info", req.session)
            await UserQuestionsService.create({
                ...req.body,
                user_fk: user.user_id,
                is_guest: false
            })
            res.json({
                message: "Consulta recibida correctamente."
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }
    static async createGuest(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await UserQuestionsService.create({
                ...req.body,
                is_guest: true,
                user_fk: null,
            })
            res.json({
                message: "Consulta recibida correctamente."
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }
}

export default UserQuestionsController