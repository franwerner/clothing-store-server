import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { GuestQuestionSchema } from "clothing-store-shared/schema";
import { ResultSetHeader } from "mysql2";

class GuestQuestionsModel extends ModelUtils {

    static async select(
        props: Partial<GuestQuestionSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("guest_questions")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async update(
        { guest_question_id, ...props }: GuestQuestionSchema.Update,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("guest_questions")
                .update({ props })
                .where({ guest_question_id })
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(
        props: GuestQuestionSchema.Insert & { limit: number },
    ) {
        try {
            const { email, lastname, message, name, phone, limit } = props
            const query = sql.raw<Array<ResultSetHeader>>(`  
                INSERT INTO guest_questions (name,lastname,email,phone,message)
                SELECT ?,?,?,?,?
                WHERE (
                SELECT COUNT(*) FROM guest_questions WHERE email = ? 
                AND DATE(create_at) = DATE(NOW())
                ) < ? `, [
                name,
                lastname,
                email,
                phone,
                message,
                email,
                limit
            ])
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default GuestQuestionsModel