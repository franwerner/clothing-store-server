import zodParse from "../helper/zodParse.helper"
import UserPurchasesModel from "../model/userPurchases.model"
import { UserPurchaseSchema, DatabaseKeySchema, userPurchaseSchema, databaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"

class UserPurchasesService {

    static async updateForUser(props: UserPurchaseSchema.Update & { user_fk: DatabaseKeySchema }) {
        const parse = zodParse(userPurchaseSchema.update.extend({ user_fk: databaseKeySchema }))(props)
        return await UserPurchasesModel.updateForUser(parse)

    }
    static async getForUser({ user_purchase_id, user_fk }: { user_purchase_id: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const [res] = await UserPurchasesModel.select({ user_purchase_id, user_fk })
        if (!res) throw new ErrorHandler({
            message: "No se encontró ninguna orden con la id especificada.",
            status: 404,
            code: "order_not_found"
        })
        return res
    }

}

export default UserPurchasesService