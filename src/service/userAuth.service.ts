import bcrypt from "bcrypt"
import UsersModel from "../model/users.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import userSchema from "../schema/user.schema.js"
import zodParse from "../helper/zodParse.helper.js"
class UserAuthService {

    static async findUserByEmail(email: string = "") {
        const [user] = await UsersModel.select({ email })
        if (!user) throw new ErrorHandler({
            message: "El email no esta asociado a ningun usuario.",
            code: "email_not_found",
            status: 422
        })
        return user
    }
    static async verifyPassword(password: string, hash: string) {
        const compare = await bcrypt.compare(password, hash)
        if (!compare) throw new ErrorHandler({
            message: "La contraseña ingresada es incorrecta.",
            code: "wrong_password",
            status: 422
        })
    }

    static async authenticar({ email, password }: { email: string, password: string }) {
        const user = await this.findUserByEmail(email)
        await this.verifyPassword(password, user.password)
        return zodParse(userSchema.formatUser)(user)
    }

}


export default UserAuthService