import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface User {
    user_id: KEYDB
    fullname: string
    phone?: string
    email: string
    password: string
    permission?: "admin" | 'standard'
    ip: string
    email_confirmed?: boolean
    create_at?: number
}

type UserWithoutID = Omit<User, 'user_id'> & { user_id?: KEYDB }

type SelectProps = Partial<User>

interface UpdateProps {
    user_id: KEYDB
    phone?: string
    email?: string
    email_confirmed?: boolean
}

class UsersModel extends ModelUtils {

    static update({ user_id, ...rest }: UpdateProps) {
        return sql("users")
            .update(rest)
            .where("user_id", user_id)
    }

    static updateUnconfirmedEmail(props: UpdateProps) {
        return this.update(props)
            .where("email_confirmed", false)
    }

    static async insertByLimitIP(user: UserWithoutID, ip_limit = 0) {
        const { email, fullname, ip, password, phone = null } = user
        return await sql.raw(`
          INSERT INTO users (fullname,phone,email,password,ip)
          SELECT ?, ?, ?, ?, ?
         WHERE (SELECT COUNT(*) FROM users WHERE ip = ?) < ?
            `, [
            fullname,
            phone,
            email,
            password,
            ip,
            ip,
            ip_limit,
        ]) as [ResultSetHeader, undefined]
    }

    static select(props: SelectProps = {}) {
        return sql("users")
            .where(this.removePropertiesUndefined(props))
    }
}

export type {
    User,
    UserWithoutID
}
export default UsersModel