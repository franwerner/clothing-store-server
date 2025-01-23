import { UserSchema } from "clothing-store-shared/schema"
import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

type UserPartial = Partial<UserSchema.Base>

class UsersModel extends ModelUtils {

    static async select(
        props: UserPartial = {},
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("users")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update(
        { user_id, ...props }: UserSchema.Update,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("users")
                .update(props)
                .where("user_id", user_id)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static updateUnconfirmedEmail(props: UserSchema.Update) {
        return this.update(props, (builder) => {
            builder.where("email_confirmed", false)
        })
    }

    static async insertByLimitIP(
        user: UserSchema.Insert,
        ip_limit = 0
    ) {
        const { email, name, lastname, ip, password, phone, permission } = user
        try {
            return await sql.raw<Array<ResultSetHeader>>(`
            INSERT INTO users (name,lastname,phone,email,password,ip,permission)
            SELECT ?,?,?,?,?,?,?
            WHERE (SELECT COUNT(*) FROM users WHERE ip = ?) < ?
              `, [
                name,
                lastname,
                phone,
                email,
                password,
                ip,
                permission,
                ip,
                ip_limit,
            ])
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "El email que estás intentando registrar ya está en uso."
            })
        }
    }

    static async delete(userID: UserSchema.Delete) {
        try {
            return await sql("users")
                .where("user_id", userID)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }
}


export default UsersModel