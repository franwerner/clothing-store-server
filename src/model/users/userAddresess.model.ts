import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { UserAddressesSchema } from "clothing-store-shared/schema";



class UserAdresessModel extends ModelUtils {

    static async select(props: Partial<UserAddressesSchema.Base>) {
        try {
            return await sql("user_addresses")
                .where(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: UserAddressesSchema.Insert) {
        try {
            return await sql("user_addresses")
            .insert(props)
        } catch (error) {
            throw this.generateError(error, { "ER_DUP_ENTRY": "El usuario ya contiene una direccion." })
        }
    }

    static async update({ user_fk, user_address_id, ...props }: UserAddressesSchema.Update) {
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