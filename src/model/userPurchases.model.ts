import sql from "../config/knex.config"
import { UserPurchaseSchema } from "../schema/userPurchase.schema"
import Exact from "../types/Exact.types"
import ModelUtils from "../utils/model.utils"


type UserPurchaseKeys = keyof UserPurchaseSchema.Base
type UserPurchasePartial = Partial<UserPurchaseSchema.Base>
type UserPurchaseRequired = Required<UserPurchaseSchema.Base>

class UserPurchasesModel extends ModelUtils {

    static async select<T extends UserPurchaseKeys = UserPurchaseKeys>(
        props: UserPurchasePartial = {},
        modify?: APP.ModifySQL<Pick<UserPurchaseRequired, T>>) {
        try {
            const query = sql<Pick<UserPurchaseRequired, T>>("user_purchases as up")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends UserPurchaseSchema.Insert>(
        user_purchase: Exact<T, UserPurchaseSchema.Insert>,
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

    static async update<T extends UserPurchaseSchema.Update>(
        { user_purchase_id, ...user_purchase }: Exact<T, UserPurchaseSchema.Update>,
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

    static async updateOperationIfNull<T extends UserPurchaseSchema.Update>(
        props: Exact<T, UserPurchaseSchema.Update>
    ) {
        return this.update(props, (builder) => {
            builder.where("operation_id", null)
        })
    }
}

export default UserPurchasesModel