import { UserPurchaseShippingSchema } from "clothing-store-shared/schema"
import ModelUtils from "@/utils/model.utils"
import sql from "@/config/knex.config"

class UserPurchaseShippingsModel extends ModelUtils {

    static async select(
        props: Partial<UserPurchaseShippingSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_shippings")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(
        props: UserPurchaseShippingSchema.Insert,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_shippings")
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async update({ user_purchase_shipping_id, ...props }: UserPurchaseShippingSchema.Update) {
        try {
            const query = sql("user_purchase_shippings")
                .where({ user_purchase_shipping_id })
                .update(props)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserPurchaseShippingsModel