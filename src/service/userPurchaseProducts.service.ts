import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import { DatabaseKeySchema, userPurchaseProductSchema, UserPurchaseProductSchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import ServiceUtils from "../utils/service.utils"
import { Knex } from "knex"
import zodParse from "../helper/zodParse.helper"
import sql from "../config/knex.config"


type CreateUserPurchaseProducts = Array<UserPurchaseProductSchema.Insert>

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

    static async calculateTotalByPurchaseID(user_purchase_fk: DatabaseKeySchema){
            const [res] = await UserPurchaseProductsModel.select(
                { user_purchase_fk },
                (builder) => {
                    builder.select(
                        sql.raw("SUM(price * (1-(discount / 100)) * quantity) as total")
                    )
                }
            )
            const { total } = res as unknown as { total: number }
            if (!total) {
                throw new ErrorHandler({
                    message: "No se pudo calcular el total porque no existen productos asociados a la orden.",
                    status: 404,
                    code: "order_products_not_found"
                });
            }
            return total
    }


    static async create(products: CreateUserPurchaseProducts, trx: Knex.Transaction) {
        const productsData = zodParse(userPurchaseProductSchema.insert.array().min(1))(products)

        for (const i of productsData) {
            const [result] = await UserPurchaseProductsModel.insert(i, trx)
            if (result.affectedRows == 0) throw new ErrorHandler({
                status: 400,
                message: "Problemas al agregar productos a la compra.",
                data: i,
                code: "failed_to_insert_products_in_purchase"
            })
        }

    }
}

export {
    CreateUserPurchaseProducts
}
export default UserPurchaseProductsService