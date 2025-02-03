import zodParse from "../helper/zodParse.helper"
import UsersModel from "../model/users.model"
import { UserSchema, userSchema, DatabaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import UserRegisterService from "./userRegister.service"
import { createUTCDate } from "my-utilities"

class UserInfoService {

    static async updateInfo(update: UserSchema.Update) {
        const { password, phone, name, lastname, user_id } = zodParse(userSchema.update)(update)
        const selectedInfo = {
            password: password && await UserRegisterService.createPassword(password),
            phone,
            name,
            lastname,
            user_id,
        }
        await UsersModel.update(selectedInfo)
    }

    static createEditExpiration() {
        return createUTCDate({minutes : 15}).toISOString()
    }

    static async getUserInfo(user_id: DatabaseKeySchema) {
        const [res] = await UsersModel.select({ user_id })
        if (!res) throw new ErrorHandler({
            status: 404,
            message: "No se encontro ningun usuario.",
            code: "user_not_found"
        })
        return zodParse(userSchema.formatUser)(res)
    }

}

export default UserInfoService