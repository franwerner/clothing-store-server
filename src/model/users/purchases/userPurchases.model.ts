import { DatabaseKeySchema, UserPurchaseSchema } from "clothing-store-shared/schema"
import { Knex } from "knex"
import { ResultSetHeader } from "mysql2"
import sql from "@/config/knex.config"
import ModelUtils from "@/utils/model.utils"

type UserPurchasePartial = Partial<UserPurchaseSchema.Base>
class UserPurchasesModel extends ModelUtils {

    static async select(
        props: UserPurchasePartial = {},
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchases as up")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async updateGuestPurchases(
        { user_fk, email }: { user_fk: DatabaseKeySchema, email: string },
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchases as up")
                .update({ user_fk })
                .whereIn("up.user_purchase_id", (builder) => {
                    builder.from("user_purchase_guests")
                        .select("user_purchase_fk")
                        .where({ email })
                })
                .where({ user_fk: null })
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(
        user_purchase: UserPurchaseSchema.Insert & { limit: number },
        trx: Knex = sql
    ) {
        try {
            const { expire_at, is_guest, note, user_fk, uuid, limit } = user_purchase
            const query = trx.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_purchases (uuid,note,expire_at,is_guest,user_fk)
                SELECT ?,?,?,?,?
                WHERE (
                SELECT COUNT(*) FROM user_purchases 
                WHERE user_fk = ?
                AND DATE(create_at) = DATE(NOW())
                ) < ?
                `, [
                uuid,
                note,
                expire_at,
                is_guest,
                user_fk,
                user_fk,
                limit
            ])

            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update(
        { user_purchase_id, ...user_purchase }: UserPurchaseSchema.Update,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchases")
                .where({ user_purchase_id })
                .update(user_purchase)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

}



export default UserPurchasesModel