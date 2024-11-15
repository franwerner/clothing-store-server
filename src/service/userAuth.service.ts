import bcrypt from "bcrypt"
import UsersModel, { User } from "../model/users.model.js"
import FormatUser from "../types/formatUser.types.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
class UserAuthService {

    static async findUserByEmail(email: string) {
        const [user] = await UsersModel.select({ email })
        if (!user) throw new ErrorHandler({ message: "El email no esta asociado a ningun usuario.", status: 422 })
        return user
    }
    static async verifyPassword(password: string, hash: string) {
        const compare = await bcrypt.compare(password, hash)
        if (!compare) throw new ErrorHandler({ message: "La contraseña ingresada es incorrecta.", status: 422 })
    }

    static formatUser(user: User) {
        const omitPropertyPassword = Object.entries(user)
            .filter(([key]) => key !== "password")
        return Object.fromEntries(omitPropertyPassword) as FormatUser
    }

    static async main({ email, password }: { email: string, password: string }) {
        const user = await this.findUserByEmail(email)
        await this.verifyPassword(password, user.password)
        const format = this.formatUser(user)
        return format
    }

}


export default UserAuthService