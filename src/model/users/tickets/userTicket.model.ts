import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { UserTicketSchema } from "clothing-store-shared/schema";
import { ResultSetHeader } from "mysql2";

class UserTicketModel extends ModelUtils {

    static async select(
        props: Partial<UserTicketSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_tickets")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(
        props: UserTicketSchema.Insert & { limit: number },
        trx = sql
    ) {
        try {
            const { request, title, user_fk, limit } = props
            trx.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_tickets (request,title,user_fk)
                SELECT ?,?,?
                WHERE (
                SELECT COUNT(*) FROM user_tickets WHERE user_fk = ?
                AND DATE(request_at) = DATE(NOW())
                ) < ?
                `, [
                request,
                title,
                user_fk,
                user_fk,
                limit
            ])
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ user_ticket_id, user_fk, ...props }: UserTicketSchema.Update) {
        try {
            await sql("user_tickets")
                .where({ user_ticket_id, user_fk })
                .update(props)
        } catch (error) {
            throw this.generateError(error)

        }
    }
}

export default UserTicketModel