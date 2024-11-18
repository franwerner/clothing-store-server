import bcrypt from "bcrypt"
import UsersModel from "../model/users.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import userSchema, { UserSchema } from "../schema/user.schema.js"
import { DatabaseKeySchema } from "../schema/databaseKey.schema.js"
import zodParse from "../helper/zodParse.helper.js"
import maxAccountPerIp from "../constant/maxAccoutPerIP.constant.js"
class UserRegisterService {

    static async completeRegister(user_id: DatabaseKeySchema) {
        const updateAffects = await UsersModel.updateUnconfirmedEmail({ user_id, email_confirmed: true })

        if (!updateAffects) {
            throw new ErrorHandler({
                message: "El email ya ha sido confirmado previamente.",
                status: 409
            })
        }
    }

    static async createAccount(user: UserSchema.Insert) {

        const [rawHeaders] = await UsersModel.insertByLimitIP(user, maxAccountPerIp)

        const { insertId, affectedRows } = rawHeaders

        if (affectedRows == 0) throw new ErrorHandler({
            message: `Superaste el limite de ${maxAccountPerIp} por IP`,
            status: 429
        })
        return {
            ...user,
            user_id: insertId,
        }
    }

    static async createPassword(password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    static async main(user: UserSchema.Insert) {

        const data = zodParse(userSchema.insert)(user)

        const hash = await this.createPassword(data.password)

        const acc = await this.createAccount({ ...data, password: hash })
        return zodParse(userSchema.formatUser)(acc)


    }
}

export default UserRegisterService