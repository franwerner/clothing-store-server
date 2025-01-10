import { UserAdresessSchema } from "clothing-store-shared/schema";
import sql from "../config/knex.config";
import ModelUtils from "../utils/model.utils";
import { ResultSetHeader } from "mysql2";

type UserAdressesPartial = Partial<UserAdresessSchema.Base>

class UserAdresessModel extends ModelUtils {

    static async select(props: UserAdressesPartial) {
        try {
            return await sql("user_adresess")
                .where(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: UserAdresessSchema.Insert) {
        const { apartament = null, locality, postal_code, province, street, street_number, user_fk } = props
        try {
            return await sql.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_adresess (postal_code,street,street_number,apartament,locality,province,user_fk)
                SELECT ?,?,?,?,?,?,? * FROM DUAL
                WHERE NOT EXISTS (
                SELECT 1 FROM user_adresses WHERE user_fk = ?
                 )
                `, [
                postal_code,
                street,
                street_number,
                apartament,
                locality,
                province,
                user_fk,
                user_fk,
                user_fk
            ])
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update(props: UserAdresessSchema.Update) {
        try {
            return await sql("user_adresess")
                .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserAdresessModel