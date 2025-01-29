import { UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import ModelUtils from "../utils/model.utils";
import { Knex } from "knex";
import { ResultSetHeader } from "mysql2";

class UserPurchaseGuestsModel extends ModelUtils {
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
                email
            ])
        } catch (error) {
            throw this.generateError(error)
        }

    }
}

export default UserPurchaseGuestsModel