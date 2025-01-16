import { UserAddresessSchema } from "clothing-store-shared/schema";
import sql from "../config/knex.config";
import ModelUtils from "../utils/model.utils";

type UserAdressesPartial = Partial<UserAddresessSchema.Base>

class UserAdresessModel extends ModelUtils {

    static async select(props: UserAdressesPartial) {
        try {
            return await sql("user_addresses")
                .where(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: UserAddresessSchema.Insert) {
        try {
            return await sql("user_addresses")
            .insert(props)
        } catch (error) {
            throw this.generateError(error, { "ER_DUP_ENTRY": "Ya contiene una direccion." })
        }
    }

    static async update({ user_fk, user_address_id, ...props }: UserAddresessSchema.Update) {
        try {
            return await sql("user_addresses")
                .where({
                    user_fk,
                    user_address_id
                })
                .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserAdresessModel