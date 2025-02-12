import creationLimits from "@/constant/creationLimit.constants";
import zodParse from "@/helper/zodParse.helper";
import UserQuestionsModel from "@/model/guestQuestions.model";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { DatabaseKeySchema, guestQuestionSchema, GuestQuestionSchema } from "clothing-store-shared/schema";

class GuestQuestionsService {
    static async create(props: GuestQuestionSchema.Insert) {
        const parse = zodParse(guestQuestionSchema.insert)(props)
        const [{ affectedRows }] = await UserQuestionsModel.insert({ ...parse, limit: creationLimits.guest_questions })
        if (!affectedRows) throw new ErrorHandler({
            message: "Demasiados consultas realizas, por favor espere.",
            code: "too_many_quetions",
            status: 429
        })
    }
    static async markQuestionAsAnswered(guest_question_id: DatabaseKeySchema) {
        const parse = zodParse(guestQuestionSchema.update)({
            guest_question_id,
            is_answered: true
        })
        await UserQuestionsModel.update(parse)
    }
}

export default GuestQuestionsService