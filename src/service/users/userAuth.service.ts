import bcrypt from "bcrypt"
import ErrorHandler from "@/utils/errorHandler.utilts.js"
import { userSchema } from "clothing-store-shared/schema"
import zodParse from "@/helper/zodParse.helper.js"
import UsersModel from "@/model/users/users.model.js"
class UserAuthService {

    static async findUserByEmail(email: string = "") {
        const [user] = await UsersModel.select({ email })
        if (!user) throw new ErrorHandler({
            message: "El correo electrónico ingresado no está registrado en nuestro sistema.",
            code: "email_not_found",
            status: 401,
        })
        return user
    }
    static async verifyPassword(password: string, hash: string) {
        const compare = await bcrypt.compare(password, hash)
        if (!compare) throw new ErrorHandler({
            message: "La contraseña ingresada es incorrecta.",
            code: "wrong_password",
            status: 401,
        })
    }

    static async authenticar({ email, password }: { email: string, password: string }) {
        const user = await this.findUserByEmail(email)
        await this.verifyPassword(password, user.password)
        return zodParse(userSchema.formatUser)(user)
    }

}

export default UserAuthService