import bcrypt from "bcrypt"
import UsersModel from "../model/users.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import userSchema, { UserSchema } from "../schema/user.schema.js"
import { DatabaseKeySchema } from "../schema/databaseKey.schema.js"
import zodParse from "../helper/zodParse.helper.js"
import storeConfig from "../constant/storeConfig.contant.js"

class UserRegisterService {

    static async completeRegister(user_id: DatabaseKeySchema) {
        const updateAffects = await UsersModel.updateUnconfirmedEmail({ user_id, email_confirmed: true })

        if (!updateAffects) {
            throw new ErrorHandler({
                message: "El email ya ha sido confirmado previamente.",
                status: 409,
                code : "conflict_email_confirmed"
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
        }, storeConfig.maxAccountPerIp)

        const { insertId, affectedRows } = rawHeaders

        if (affectedRows == 0) throw new ErrorHandler({
            message: `Superaste el limite de ${storeConfig.maxAccountPerIp} por IP`,
            code: "limit_account_per_ip",
            status: 429
        })
        return zodParse(userSchema.formatUser)({
            ...data,
            user_id: insertId,
        })
    }


}

export default UserRegisterService