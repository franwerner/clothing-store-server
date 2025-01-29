import bcrypt from "bcrypt"
import UsersModel from "../model/users.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import { DatabaseKeySchema, UserSchema, userSchema } from "clothing-store-shared/schema"
import zodParse from "../helper/zodParse.helper.js"

const max_count_per_ip = 10

class UserRegisterService {

    static async completeRegister(user_id: DatabaseKeySchema) {
        const data = zodParse(userSchema.update)({ user_id, email_confirmed: true })
        const updateAffects = await UsersModel.updateUnconfirmedEmail(data)

        if (!updateAffects) {
            throw new ErrorHandler({
                message: "El email ya se encuentra confirmado.",
                status: 409,
                code: "email_already_confirmed"
            })
        }
    }

    static async createPassword(password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    static async registerAccount(user: UserSchema.Insert) {
        const data = zodParse(userSchema.insert)(user)
        const hash = await this.createPassword(data.password)
        const [rawHeaders] = await UsersModel.insertByLimitIP({
            ...data,
            password: hash
        }, max_count_per_ip)
        const { insertId, affectedRows } = rawHeaders
        if (affectedRows == 0) throw new ErrorHandler({
            message: `Superaste el limite de ${max_count_per_ip} cuentas por IP.`,
            code: "limit_account_per_ip",
            status: 429
        })
        return userSchema.formatUser.parse({
            ...data,
            user_id: insertId,
        })
    }


}


export default UserRegisterService