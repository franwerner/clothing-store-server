import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"

interface User {
    user_id: KEYDB
    fullname: string
    phone?: string | null
    email: string
    password: string
    permission?: "admin" | "standard"
    ip: string
    email_confirmed?: boolean
    create_at?: string
}

type UserKeys = keyof User
type UserPartial = Partial<User>
type UserRequired = Required<User>
type UserInsert = Pick<User, "fullname" | "email" | "password" | "ip" | "phone" | "permission">
type UserUpdate = UserPartial & { user_id: KEYDB }

class UsersModel extends ModelUtils {

    static async select<T extends UserKeys = UserKeys>(
        props: UserPartial = {},
        modify?: ModifySQL<Pick<UserRequired, T>>
    ) {
        try {
            const query = sql<Pick<UserRequired, T>>("users")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ user_id, ...props }: UserUpdate, modify?: ModifySQL) {
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

    static updateUnconfirmedEmail(props: UserUpdate) {
        return this.update(props, (builder) => {
            builder.where("email_confirmed", false)
        })
    }

    static async insertByLimitIP(user: UserInsert, ip_limit = 0) {
        const { email, fullname, ip, password, phone = null, permission = "standard" } = user
        try {
            return await sql.raw<Array<ResultSetHeader>>(`
            INSERT INTO users (fullname,phone,email,password,ip,permission)
            SELECT ?, ?, ?, ?, ?,?
            WHERE (SELECT COUNT(*) FROM users WHERE ip = ?) < ?
              `, [
                fullname,
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

    static async delete(userIDs: Array<KEYDB>) {
        try {
            return await sql("users")
                .whereIn("user_id", userIDs)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export type {
    User,
    UserInsert
}
export default UsersModel