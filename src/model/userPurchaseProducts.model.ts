import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config"
import Exact from "../types/Exact.types"
import ModelUtils from "../utils/model.utils"
import { Knex } from "knex"
import { DatabaseKeySchema, UserPurchaseProductSchema } from "clothing-store-shared/schema"

type UserPurchaseProductPartial = Partial<UserPurchaseProductSchema.Base>

class UserPurchaseProductsModel extends ModelUtils {
    static async select(
        props: UserPurchaseProductPartial = {},
        modify?: APP.ModifySQL) {
        try {
            const query = sql("user_purchase_products as upp")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectForUser(
        { user_fk, ...props }: UserPurchaseProductPartial & { user_fk: DatabaseKeySchema },
        modify?: APP.ModifySQL
    ) {
        return this.select(props, (builder) => {
            builder.whereExists(
                sql("user_purchases")
                    .select(1)
                    .where({ user_fk: user_fk, user_purchase_id: props.user_purchase_fk })
            )
            modify && builder.modify(modify)
        })
    }


    static async selectDetailed(
        props: UserPurchaseProductPartial = {},
        modify?: APP.ModifySQL
    ) {
        return this.select(props, (builder) => {
            builder.innerJoin("products as p", "p.product_id", "upp.product_fk")
                .innerJoin("colors as c", "c.color_id", "upp.color_fk")
                .innerJoin("sizes as s", "s.size_id", "upp.size_fk")

            modify && builder.modify(modify)
        })
    }

    static async selectDetailedForUser(
        { user_fk, ...props }: { user_fk: DatabaseKeySchema } & UserPurchaseProductPartial,
        modify?: APP.ModifySQL
    ) {
        return this.selectDetailed(props, (builder) => {
            builder.whereExists(
                sql("user_purchases")
                    .select(1)
                    .where({ user_fk: user_fk, user_purchase_id: props.user_purchase_fk })
            )
            modify && builder.modify(modify)
        })
    }

    static async insert<T extends UserPurchaseProductSchema.Insert>(
        props: Exact<T, UserPurchaseProductSchema.Insert>,
        tsx: Knex<any> = sql
    ) {
        const { color_fk, product_fk, size_fk, user_purchase_fk, quantity, price, discount = 0 } = props
        try {
            /**
 * Solo se inserta en la base de datos si el producto, color y tamaño están relacionados.
 * No se verifica el stock ni el estado del producto, ya que si el producto estuvo disponible en el carrito de compras en el momento de la selección,
 * se asume que estaba disponible en ese momento.
 * Para evitar una mala experiencia del usuario, la orden se procesará independientemente de si el stock o el estado del producto cambian después.
 */
            const query = tsx.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_purchase_products (product_fk,user_purchase_fk,color_fk,size_fk,quantity,price,discount)
                SELECT ?,?,?,?,?,?,? FROM
                products p
                INNER JOIN product_colors pc ON pc.product_fk = p.product_id 
                INNER JOIN product_color_sizes pcs ON pcs.product_color_fk = pc.product_color_id  
                WHERE p.product_id = ? AND 
                pc.color_fk = ? AND  
                pcs.size_fk = ?
                `, [
                product_fk,
                user_purchase_fk,
                color_fk,
                size_fk,
                quantity,
                price,
                discount,
                product_fk,
                color_fk,
                size_fk
            ])
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}
export default UserPurchaseProductsModel