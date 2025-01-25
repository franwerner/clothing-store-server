import { DatabaseKeySchema, UserPurchaseAddressesSchema } from "clothing-store-shared/schema";
import ModelUtils from "../utils/model.utils";
import sql from "../config/knex.config";

class UserPurchaseAddresessModel extends ModelUtils {

    static async select(
        props: Partial<UserPurchaseAddressesSchema.Base>,
        modify: APP.ModifySQL
    ) {
        try {
            return await sql("user_purchase_addresses")
                .where(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    // static async selectByUser({ user_purchase_fk, ...props }: Partial<UserPurchaseAddressesSchema.Base> & {user_fk: DatabaseKeySchema}) {
    //     return this.select(props, (builder) => {
    //         return builder
    //         .whereExists(
    //             sql("user_purchases")
    //             .select(1)
    //             .where({user_purchase_fk,})
    //         )
    //     })

    // }

    static async insert(
        props: UserPurchaseAddressesSchema.Insert,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_addresses")
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserPurchaseAddresessModel