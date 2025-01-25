import { UserPurchaseSchema } from "clothing-store-shared/schema"
import sql from "../config/knex.config"
import ModelUtils from "../utils/model.utils"

type UserPurchasePartial = Partial<UserPurchaseSchema.Base>
class UserPurchasesModel extends ModelUtils {

    static async select(
        props: UserPurchasePartial = {},
        modify?: APP.ModifySQL) {
        try {
            const query = sql("user_purchases as up")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(
        user_purchase: UserPurchaseSchema.Insert,
        modify?: APP.ModifySQL<any>
    ) {
        try {
            const query = sql("user_purchases")
                .insert(user_purchase)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update(
        { user_purchase_id, ...user_purchase }: UserPurchaseSchema.Update,
        modify?: APP.ModifySQL<any>
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