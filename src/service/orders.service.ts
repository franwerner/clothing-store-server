import { Knex } from "knex"
import sql from "../config/knex.config"
import zodParse from "../helper/zodParse.helper"
import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import UserPurchasesModel from "../model/userPurchases.model"
import userPurchaseSchema, { UserPurchaseSchema } from "../schema/userPurchase.schema"
import userPurchaseProductSchema, { UserPurchaseProductSchema } from "../schema/userPurchaseProduct.schema"
import ErrorHandler from "../utils/errorHandler.utilts"

interface OrderDetails {
    order_details: UserPurchaseSchema.Insert,
    products: Array<Omit<UserPurchaseProductSchema.Insert, "user_purchase_fk">>
}


class OrdersService {

    static async createOrder({ order_details, products }: OrderDetails) {
        let tsx = {} as Knex.Transaction
        try {
            const orderData = zodParse(userPurchaseSchema.insert)(order_details)
            tsx = await sql.transaction()
            const [user_purchase_id] = await UserPurchasesModel.insert(orderData, (builder) => {
                builder.transacting(tsx)
            })
            const productWithID = products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }))
            const productsData = zodParse(userPurchaseProductSchema.insert.array())(productWithID)

            const user_purchase_products_id = await Promise.all(productsData.map(async i => {
                const [result] = await UserPurchaseProductsModel.insert(i)
                if (result.affectedRows == 0) throw new ErrorHandler({
                    message: "Lamentablemente, uno de los productos seleccionados no está disponible para su compra en este momento.",
                    status: 400
                });
                return result.insertId
            }))

            await tsx.commit()
            return {
                user_purchase_id,
                user_purchase_products_id
            }
        } catch (error) {
            if (tsx.rollback) await tsx.rollback()
            throw error
        }

    }


}


export default OrdersService