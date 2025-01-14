import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import { DatabaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import ServiceUtils from "../utils/service.utils"



class UserPurchaseProductsService extends ServiceUtils {
    static async getForUser({ user_purchase_fk, user_fk }: { user_purchase_fk: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const res = await UserPurchaseProductsModel.selectDetailedForUser({ user_purchase_fk, user_fk })
        if (res.length == 0) throw new ErrorHandler({
            status: 404,
            message: "Los detalles de la orden que intentas obtener no se encuentran disponibles.",
            code : "order_products_not_found"
        })
        return res
    }
}

export default UserPurchaseProductsService