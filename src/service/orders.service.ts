import { Knex } from "knex"
import sql from "../config/knex.config"
import zodParse from "../helper/zodParse.helper"
import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import UserPurchasesModel from "../model/userPurchases.model"
import { userPurchaseProductSchema, UserPurchaseProductSchema, UserPurchaseSchema, userPurchaseSchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts"
import ServiceUtils from "../utils/service.utils"

interface CreateOrder {
    order: Omit<UserPurchaseSchema.Insert, "expire_at"> & { expire_at: Date },
    order_products: Array<Omit<UserPurchaseProductSchema.Insert, "user_purchase_fk">>
}

class OrdersService extends ServiceUtils {
    private static adapteExpireDataToDB(date: Date) {
        return date.toISOString().replace('T', ' ').substring(0, 19)
    }

    static async create({ order, order_products }: CreateOrder) {
        let tsx = {} as Knex.Transaction
        try {
            const orderData = zodParse(userPurchaseSchema.insert)({
                ...order,
                expire_at: this.adapteExpireDataToDB(order.expire_at)
            })
            tsx = await sql.transaction()
            const [user_purchase_id] = await UserPurchasesModel.insert(orderData, (builder) => builder.transacting(tsx))
            const productsWithID = order_products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }))
            const productsData = zodParse(userPurchaseProductSchema.insert.array().min(1))(productsWithID)
            const user_purchase_products_id = await Promise.all(productsData.map(async i => {
                const [result] = await UserPurchaseProductsModel.insert(i, tsx)
                if (result.affectedRows == 0) throw new ErrorHandler({
                    status: 400,
                    message: "Problemas con los productos de la orden.",
                    data: i,
                    code: "product_unavailable"
                });
                return result.insertId
            }))

            await tsx.commit()

            return {
                user_purchase_id,
                user_purchase_products_id,
            }
        } catch (error) {
            if (tsx.rollback) await tsx.rollback()
            throw error
        }
    }


}

export default OrdersService