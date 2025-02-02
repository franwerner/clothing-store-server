import { databaseKeySchema, DatabaseKeySchema, UserPurchaseSchema } from "clothing-store-shared/schema"
import sql from "../config/knex.config"
import ModelUtils from "../utils/model.utils"

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

    static async selectPurchasesCount(
        props:UserPurchasePartial & {user_fk : DatabaseKeySchema},
        modify?: APP.ModifySQL
    ){
        return await this.select(props,(b) => {
            b.count("*")
            modify && b.modify(modify)
        })
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
        user_purchase: UserPurchaseSchema.Insert,
        modify?: APP.ModifySQL
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