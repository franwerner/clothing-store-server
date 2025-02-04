import { UserPurchaseAddressesSchema } from "clothing-store-shared/schema";
import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";

class UserPurchaseAddresessModel extends ModelUtils {

    static async select(
        props: Partial<UserPurchaseAddressesSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_addresses")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

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