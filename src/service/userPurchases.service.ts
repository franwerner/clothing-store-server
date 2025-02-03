import { DatabaseKeySchema, UserPurchaseSchema, userPurchaseSchema, UserSchema } from "clothing-store-shared/schema"
import zodParse from "../helper/zodParse.helper"
import UserPurchasesModel from "../model/userPurchases.model"
import ErrorHandler from "../utils/errorHandler.utilts"
import { Knex } from "knex"
import shortUUID from "short-uuid"
import UsersModel from "@/model/users.model"
import sql from "@/config/knex.config"

type CreateUserPurchase = Omit<UserPurchaseSchema.Insert, "note" | "uuid">
class UserPurchasesService {

    static async update(
        props: UserPurchaseSchema.Update,
        trx?: Knex.Transaction
    ) {
        const parse = zodParse(userPurchaseSchema.update)(props)
        await UserPurchasesModel.update(parse, (builder) => {
            trx && builder.transacting(trx)
        })
    }


    static async syncGuestPurchases({ email, user_id, guest_purchases_synced, email_confirmed }: UserSchema.FormatUser) {
        if (guest_purchases_synced || !email_confirmed) return
        await sql.transaction(async (tsx) => {
            await UserPurchasesModel.updateGuestPurchases({ email, user_fk: user_id }, (b) => b.transacting(tsx))
            await UsersModel.update({ user_id, guest_purchases_synced: true }, (b) => b.transacting(tsx).where({ guest_purchases_synced: false }))
        })
    }

    static async create({ expire_at, ...props }: CreateUserPurchase, trx: Knex.Transaction) {
        const uuid = shortUUID().generate()
        const orderData = zodParse(userPurchaseSchema.insert)({
            ...props,
            expire_at,
            uuid
        })
        const [{ affectedRows, insertId }] = await UserPurchasesModel.insert({ ...orderData, limit_by_ip: 99999, expire_at }, trx)
        if (!affectedRows) throw new ErrorHandler({
            message: "Alcanzaste un máximo de 10 compras por día",
            code: "limit_purchases",
            status: 429
        })
        return {
            user_purchase_id: insertId,
            uuid
        }
    }

    static async getByUser({ user_purchase_id, user_fk }: { user_purchase_id: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const [res] = await UserPurchasesModel.select({ user_purchase_id, user_fk })
        if (!res) throw new ErrorHandler({
            message: "No se encontró ninguna compra con la id especificada.",
            status: 404,
            code: "purchase_not_found"
        })
        return res
    }

}

export {
    type CreateUserPurchase
}
export default UserPurchasesService