import zodParse from "../helper/zodParse.helper"
import UsersModel from "../model/users.model"
import { UserSchema, userSchema, DatabaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import UserRegisterService from "./userRegister.service"

const onlyInfo = userSchema.update.omit({ email_confirmed: true, email: true, guest_purchases_synced: true })

class UserInfoService {

    static async updateInfo(update: UserSchema.Update) {
        const { password, phone, name, lastname, user_id } = zodParse(onlyInfo)(update)
        const selectedInfo = {
            password: password && await UserRegisterService.createPassword(password),
            phone,
            name,
            lastname,
            user_id,
        }
        await UsersModel.update(selectedInfo)
    }

    static async syncGuestPurchases(user_id: DatabaseKeySchema) {
        //Falta agregar la logica de sincronizacion de compras de invitado
        const res = await UsersModel.update({ user_id, guest_purchases_synced: true })
        if (res === 0) throw new ErrorHandler({
            message: "No se logro sincronizar las compras de invitado.",
            code: "sync_guest_purchases_failed"
        })
    }

    static createEditAuthorization() {
        return {
            expired_at: Date.now() + (1000 * 60 * 15), //15m,
            isAuthorized: true
        }
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