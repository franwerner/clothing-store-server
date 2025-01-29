import { DatabaseKeySchema, UserPurchaseSchema, userPurchaseSchema } from "clothing-store-shared/schema"
import zodParse from "../helper/zodParse.helper"
import UserPurchasesModel from "../model/userPurchases.model"
import ErrorHandler from "../utils/errorHandler.utilts"
import { Knex } from "knex"
import adapteDateToDB from "../utils/adapteDateToDB.utilts"

type CreateUserPurchase = Omit<UserPurchaseSchema.Insert, "note" | "uuid"> & { expire_at: Date }
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

    static async create({ expire_at, ...props }: CreateUserPurchase, trx: Knex.Transaction) {
        const uuid = crypto.randomUUID()
        const orderData = zodParse(userPurchaseSchema.insert)({
            ...props,
            expire_at: adapteDateToDB(expire_at),
            uuid
        })
        const [user_purchase_id] = await UserPurchasesModel.insert(orderData, (builder) => builder.transacting(trx))

        return {
            user_purchase_id,
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