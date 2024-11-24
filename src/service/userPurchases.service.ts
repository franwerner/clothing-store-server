import zodParse from "../helper/zodParse.helper"
import UserPurchasesModel from "../model/userPurchases.model"
import userPurchaseSchema, { UserPurchaseSchema } from "../schema/userPurchase.schema"
import ErrorHandler from "../utils/errorHandler.utilts"

class userPurchasesService {

    static async updateOperationID(props: UserPurchaseSchema.Update) {
        const data = zodParse(userPurchaseSchema.update)(props)
        const res = await UserPurchasesModel.updateOperationIfNull(data)
        if (res === 0) throw new ErrorHandler({
            message: "No se puede actualizar el ID de la operación porque ya tiene un valor asignado",
            status: 400
        })
        return res
    }


}


export default userPurchasesService