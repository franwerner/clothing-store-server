import bcrypt from "bcrypt"
import UsersModel, { User } from "../model/users.model.js"
import { ResultSetHeader } from "mysql2"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
import sql from "../database/index.js"

class UserRegisterService {
    static isValidPassword(password: string) {
        const passwordRequirements: Array<{ regexp: RegExp, description: string }> = [
            { regexp: /^(?=.*[A-Z])/, description: "Debe contener al menos una letra mayúscula" },
            { regexp: /(?=.*[\W_])/, description: "Debe contener al menos un carácter especial (o guion bajo)" },
            { regexp: /(?=.*\d)/, description: "Debe contener al menos un número" },
            { regexp: /.{8,16}$/, description: "Debe tener entre 8 y 16 caracteres de longitud" }
        ]
        const requirementsNotMet = passwordRequirements.filter(({ regexp }) => !regexp.test(password))

        if (requirementsNotMet.length > 0) {
            throw new ErrorHandler({
                message: "La contraseña no es segura.",
                status: 422,
                data: requirementsNotMet.map(({ description }) => description)
            })
        }
    }

    static async createAccount(user: User) {
        const maxAccoutPerIP = 10
        
        const { password, email, fullname } = user

        UserRegisterService.isValidPassword(password)
        UserRegisterService.isValidEmail(email)
        UserRegisterService.isValidFullname(fullname)

        const hash = await UserRegisterService.createPassword(password)

        const [rawHeaders] = await UsersModel.insertByLimitIP({
            ...user,
            password: hash
        }, maxAccoutPerIP)
        const { insertId, affectedRows } = rawHeaders

        if (affectedRows == 0) throw new ErrorHandler({
            message: `Superaste el limite de ${maxAccoutPerIP} por IP`,
            status: 429
        })
        return insertId
    }

    static isValidEmail(email: string) {
        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isEmail = regExp.test(email)
        if (!isEmail) {
            throw new ErrorHandler({
                message: "No es un email valido.",
                status: 422
            })
        }
    }

    static isValidFullname(fullname: string) {
        const regExp = /^[A-Za-z]+( [A-Za-z]+){1,}$/
        const isFullname = regExp.test(fullname)
        if (!isFullname) {
            throw new ErrorHandler({
                message: "Los datos del nombre y apellido no son correctos.",
                status: 422
            })
        }
    }

    static async createPassword(password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }



}

export default UserRegisterService