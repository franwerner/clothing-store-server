import zodParse from "../helper/zodParse.helper"
import UserPurchasesModel from "../model/userPurchases.model"
import { DatabaseKeySchema } from "../schema/databaseKey.schema"
import userPurchaseSchema, { UserPurchaseSchema } from "../schema/userPurchase.schema"
import ErrorHandler from "../utils/errorHandler.utilts"

class userPurchasesService {

    static async updateStatus(props: UserPurchaseSchema.Update) {
        const data = zodParse(userPurchaseSchema.update)(props)
        const res = await UserPurchasesModel.update(data)
        if (res === 0) throw new ErrorHandler({
            status: 400,
            message: "Al parecer ocurrio un error al intentar actualizar el estado de la orden de compra."
        })
        return res
    }

    static async getForUser({ user_purchase_id, user_fk }: { user_purchase_id: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const [res] = await UserPurchasesModel.select({ user_purchase_id, user_fk })
        if (!res) throw new ErrorHandler({
            message: "No se encontró ninguna orden con la id especificada.",
            status: 404
        })
        return res
    }

}

export default userPurchasesService