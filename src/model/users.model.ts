import sql from "../database/index.js"

interface User {
    user_id?: number
    fullname: string
    phone?: string
    email: string
    password: string
    permission?: "admin" | 'standard',
    ip : string
}

class UsersModel {

    static insert(user: User) {
        return sql("users")
            .insert(user)
    }

    static update() {

    }

    static select({ email}: { email?: string }) {
        const query = sql("users")
        email && query.where("email", email)
        return query
    }
}


export default UsersModel