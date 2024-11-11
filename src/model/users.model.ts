import { ResultSetHeader } from "mysql2"
import sql from "../database/index.js"

interface User {
    user_id?: number
    fullname: string
    phone?: string
    email: string
    password: string
    permission?: "admin" | 'standard'
    ip: string
    email_confirmed ?: boolean
    create_at ?: number
}

class UsersModel {

    static insert(user: User) {
        return sql("users")
            .insert(user)
    }

    static update({ user_id, ...rest }: { user_id: number, phone?: string, email?: string }) {
        return sql("users")
            .update(rest)
            .where("user_id", user_id)
    }

    static async insertByLimitIP(user: User, ip_limit = 0) {
        const { email, fullname, ip, password, phone = null } = user
        return await sql.raw(`
          INSERT INTO users (fullname,phone,email,password,ip)
          SELECT ?, ?, ?, ?, ?
         WHERE (SELECT COUNT(*) FROM users WHERE ip = ?) < ${ip_limit}
            `, [
            fullname,
            phone,
            email,
            password,
            ip,
            ip
        ]) as [ResultSetHeader, undefined]
    }

    static selectByIP(ip: string) {
        return sql("users")
            .where("ip", ip)
    }

    static select({ email,user_id }: { email?: string ,user_id?:string | number} = {}) {
        const query = sql("users")
        email && query.where("email", email)
        user_id && query.where("user_id",user_id)
        return query
    }
}

export {
    type User
}
export default UsersModel