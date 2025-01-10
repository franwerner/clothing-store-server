import zodParse from "../helper/zodParse.helper"
import UsersModel from "../model/users.model"
import  { UserSchema,userSchema,DatabaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import UserRegisterService from "./userRegister.service"

class UserAccountService {

    static async updateInfo(update: UserSchema.UpdateInfo) {
        const { password, phone, fullname, user_id } = zodParse(userSchema.updateInfo)(update)
        const selectedInfo = {
            password: password && await UserRegisterService.createPassword(password),
            phone,
            fullname,
            user_id
        }
        return await UsersModel.update(selectedInfo)
    }

    static  createEditAuthorization(){
        return  {
            expired_at: Date.now() + (1000 * 60 * 15), //15m,
            isAuthorized: true
        }
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