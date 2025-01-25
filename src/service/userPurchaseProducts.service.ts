import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import { DatabaseKeySchema, userPurchaseProductSchema, UserPurchaseProductSchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import ServiceUtils from "../utils/service.utils"
import { Knex } from "knex"
import zodParse from "../helper/zodParse.helper"


type CreateUserPurchaseProducts = Array<Omit<UserPurchaseProductSchema.Insert, "user_purchase_fk">>

class UserPurchaseProductsService extends ServiceUtils {
    static async getForUser({ user_purchase_fk, user_fk }: { user_purchase_fk: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const res = await UserPurchaseProductsModel.selectDetailedForUser({ user_purchase_fk, user_fk })
        if (res.length == 0) throw new ErrorHandler({
            status: 404,
            message: "Los productos que intentas obtener no se encuentran disponibles.",
            code: "purchase_products_not_found"
        })
        return res
    }

    static async create(products: CreateUserPurchaseProducts, tsx: Knex.Transaction) {
        const productsData = zodParse(userPurchaseProductSchema.insert.array().min(1))(products)

        for (const i of productsData) {
            const [result] = await UserPurchaseProductsModel.insert(i, tsx)
            if (result.affectedRows == 0) throw new ErrorHandler({
                status: 400,
                message: "Problemas al agregar productos a la compra.",
                data: i,
                code: "failed_to_insert_products_in_purchase"
            })
            return result.insertId
        }

    }
}

export {
    CreateUserPurchaseProducts
}
export default UserPurchaseProductsService