import { ResultSetHeader } from "mysql2"
import sql from "../database/index.js"

interface User {
    user_id?: number
    fullname: string
    phone?: string
    email: string
    password: string
    permission?: "admin" | 'standard',
    ip: string
}

class UsersModel {

    static insert(user: User) {
        return sql("users")
            .insert(user)
    }

    static update() {

    }

    static async insertByLimitIP(user: User, ip_limit = 0){
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
        ]) as [ResultSetHeader,undefined]
    }

    static selectByIP(ip: string) {
        return sql("users")
            .where("ip", ip)
    }

    static select({ email }: { email?: string }) {
        const query = sql("users")
        email && query.where("email", email)
        return query
    }
}

export {
    type User
}
export default UsersModel