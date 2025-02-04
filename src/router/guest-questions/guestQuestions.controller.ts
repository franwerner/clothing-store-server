import GuestQuestionsService from "@/service/guestQuestions.service";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { NextFunction, Request } from "express";

class GuestQuestionsController {
    static async create(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await GuestQuestionsService.create(req.body)
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
    static async update(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { guest_question_id } = req.params
            await GuestQuestionsService.markQuestionAsAnswered(guest_question_id)
            res.json({
                message: "Consulta marcada como resuelta correctamente."
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

export default GuestQuestionsController