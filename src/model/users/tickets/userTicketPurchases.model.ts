import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { DatabaseKeySchema, UserTicketPurchaseSchema } from "clothing-store-shared/schema";

class UserTicketPurchasesModel extends ModelUtils {

    static async insert(
        props: UserTicketPurchaseSchema.Insert,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_ticket_purchases")
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectJoinUserTicket(
        user_ticket_fk: DatabaseKeySchema,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_ticket_purchaes")
                .select({ user_ticket_fk })
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)

        }
    }
}

export default UserTicketPurchasesModel