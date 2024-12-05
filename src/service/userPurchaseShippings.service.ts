import sql from "../config/knex.config";
import UserPurchaseProductsModel from "../model/userPurchaseProducts.model";
import { DatabaseKeySchema } from "clothing-store-shared/schema";
import ErrorHandler from "../utils/errorHandler.utilts";

class UserPurchaseShippings {

    static async calculateFreeShipping(props: { user_purchase_fk: DatabaseKeySchema, user_fk: DatabaseKeySchema }) {
        const [res] = await UserPurchaseProductsModel.selectForUser(
            props,
            (builder) => {
                builder.select(
                    sql.raw("SUM(price * (1-(discount / 100)) * quantity) as total")
                )
            }
        )
        const { total } = res as unknown as { total: number }
        if (!total) {
            throw new ErrorHandler({
                message: "No se pudo calcular el total porque no existen productos asociados a la orden con el ID especificado.",
                status: 404,
                code : "order_products_not_found"
            });
        }

        return total

    }
}


export default UserPurchaseShippings