import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import { Knex } from "knex";
import { ResultSetHeader } from "mysql2";

type PartialSelect = Partial<UserPurchaseGuestsSchema.Base>
class UserPurchaseGuestsModel extends ModelUtils {

    static async select(
        props: PartialSelect,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_guests as upg")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)

        }
    }

    static async selectPurchasesToday(props: PartialSelect) {
        return this.select(props, (b) => {
            b.count()
            b.innerJoin("user_purchases as up", "up.user_purchase_id", "upg.user_purchase_fk")
            b.whereRaw("DATE(up.create_at) = DATE(now())")
        })
    }

    static async insert(
        props: UserPurchaseGuestsSchema.Insert,
        trx: Knex.Transaction
    ) {
        try {
            const { email, lastname, name, user_purchase_fk } = props
            return await trx.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_purchase_guests (name,lastname,email,user_purchase_fk)
                SELECT ?,?,?,?
                WHERE NOT EXISTS(
                SELECT 1 FROM users
                WHERE users.email = ?
                ) 
                `, [
                name,
                lastname,
                email,
                user_purchase_fk,
                email,
            ])
        } catch (error) {
            throw this.generateError(error)
        }

    }
}


export default UserPurchaseGuestsModel