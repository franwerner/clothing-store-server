import zodParse from "@/helper/zodParse.helper";
import UserQuestionsModel from "@/model/userQuestions.model";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { userQuestionSchema, UserQuestionSchema } from "clothing-store-shared/schema";

class UserQuestionsService {
    static async create(props: UserQuestionSchema.Insert) {
        const parse = zodParse(userQuestionSchema.insert)(props)
        const [{ affectedRows }] = await UserQuestionsModel.insert(parse)
        if (!affectedRows) throw new ErrorHandler({
            message: "Este correo ya está en uso. por favor utiliza otro para completar la consulta.",
            code: "email_already_registered",
            status: 409
        })
    }
    static async update(props: UserQuestionSchema.Update) {
        const parse = zodParse(userQuestionSchema.update)(props)
        await UserQuestionsModel.update(parse)
    }
}

export default UserQuestionsService