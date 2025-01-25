import { UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import ModelUtils from "../utils/model.utils";
import sql from "../config/knex.config";

class UserPurchaseGuestsModel extends ModelUtils {
    static async insert(
        props: UserPurchaseGuestsSchema.Insert,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_purchase_guests")
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }

    }
}

export default UserPurchaseGuestsModel