import zodParse from "../helper/zodParse.helper"
import UsersModel from "../model/users.model"
import { DatabaseKeySchema } from "../schema/databaseKey.schema"
import userSchema, { UserSchema } from "../schema/user.schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import UserRegisterService from "./userRegister.service"

class UserAccountService {

    static async updateInfo(update: UserSchema.UpdateInfo) {
        const { password, phone, fullname, user_id } = zodParse(userSchema.update)(update)
        const selectedInfo = {
            password: password && await UserRegisterService.createPassword(password),
            phone,
            fullname,
            user_id
        }
        const res = await UsersModel.update(selectedInfo)
        if (res === 0) {
            throw new ErrorHandler({
                status: 400,
                message: "Hubo un inconveniente al actualizar la informacion. Por favor, inténtalo nuevamente más tarde.",
                code : "user_update_info"
            })
        }
        return res
    }

    static async getUserInfo(user_id: DatabaseKeySchema) {
        const [res] = await UsersModel.select({ user_id })
        if (!res) throw new ErrorHandler({
            status: 404,
            message: "No se encontro ningun usuario.",
            code : "user_not_found"
        })
        return zodParse(userSchema.formatUser)(res)
    }

}

export default UserAccountService