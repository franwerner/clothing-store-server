import zodParse from "../helper/zodParse.helper"
import UsersModel from "../model/users.model"
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
                message: "Hubo un inconveniente al actualizar la informacion. Por favor, inténtalo nuevamente más tarde."
            })
        }
        return res
    }

}

export default UserAccountService