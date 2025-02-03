import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { UserQuestionSchema } from "clothing-store-shared/schema";
import { Knex } from "knex";
import { ResultSetHeader } from "mysql2";

class UserQuestionsModel extends ModelUtils {

    static async select(
        props: Partial<UserQuestionSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_questions")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(
        props: UserQuestionSchema.Insert,
    ) {
        try {
            const { email, is_guest, lastname, message, name, phone, user_fk } = props
            const query = sql.raw<Array<ResultSetHeader>>(`  
                INSERT INTO user_questions (name,lastname,email,phone,user_fk,is_guest)
                SELECT ?,?,?,?,?,?
                WHERE NOT EXISTS(
                SELECT 1 FROM users
                WHERE users.email = ?
                )`, [
                name,
                lastname,
                email,
                phone,
                user_fk,
                is_guest,
                email
            ])

            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async update(
        { user_question_id, ...props }: UserQuestionSchema.Update,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_questions")
                .where({ user_question_id })
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserQuestionsModel