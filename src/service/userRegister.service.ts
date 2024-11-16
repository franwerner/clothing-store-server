import bcrypt from "bcrypt"
import UsersModel, { User, UserInsert } from "../model/users.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
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

    static async completeRegister(user_id: KEYDB) {
        const updateAffects = await UsersModel.updateUnconfirmedEmail({ user_id, email_confirmed: true })

        if (!updateAffects) {
            throw new ErrorHandler({
                message: "El email ya ha sido confirmado previamente.",
                status: 409
            })
        }
    }

    static async createAccount(user: UserInsert) {

        const maxAccoutPerIP = 10

        if (user.permission === "admin") {
            /**
     * Los datos del usuario ingresado siempre serán "standard", ya que los agregamos manualmente.
     * Esta validación asegura que no se creen cuentas con permisos de ADMIN por error.
     * Es una medida preventiva para evitar problemas derivados de una asignación incorrecta de permisos.
     */
            throw new ErrorHandler({
                message: "No puede crear una cuenta con permisos de ADMIN.",
                status: 400
            })
        }

        const [rawHeaders] = await UsersModel.insertByLimitIP(user, maxAccoutPerIP)

        const { insertId, affectedRows } = rawHeaders

        if (affectedRows == 0) throw new ErrorHandler({
            message: `Superaste el limite de ${maxAccoutPerIP} por IP`,
            status: 429
        })

        return {
            ...user,
            user_id: insertId
        }
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

    static async main(user: UserInsert) {

        const { password, email, fullname } = user

        this.isValidPassword(password)
        this.isValidEmail(email)
        this.isValidFullname(fullname)

        const hash = await this.createPassword(password)

        const obj: UserInsert = {
            ...user,
            password: hash,
            permission: "standard"
        }
        return await this.createAccount(obj)


    }
}

export default UserRegisterService