import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config"
import Exact from "../types/Exact.types"
import ModelUtils from "../utils/model.utils"
import { Knex } from "knex"
import { DatabaseKeySchema,UserPurchaseProductSchema } from "clothing-store-shared/schema"

type UserPurchaseProductKeys = keyof UserPurchaseProductSchema.Base
type UserPurchaseProductPartial = Partial<UserPurchaseProductSchema.Base>
type UserPurchaseProductRequired = Required<UserPurchaseProductSchema.Base>

class UserPurchaseProductsModel extends ModelUtils {
    static async select<T extends UserPurchaseProductKeys = UserPurchaseProductKeys>(
        props: UserPurchaseProductPartial = {},
        modify?: APP.ModifySQL<Pick<UserPurchaseProductRequired, T>>) {
        try {
            const query = sql<Pick<UserPurchaseProductRequired, T>>("user_purchase_products as upp")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectForUser<T extends UserPurchaseProductKeys = UserPurchaseProductKeys>(
        { user_fk, ...props }: UserPurchaseProductPartial & { user_fk: DatabaseKeySchema },
        modify?: APP.ModifySQL<Pick<UserPurchaseProductRequired, T>>
    ) {
        return this.select<T>(props, (builder) => {
            builder.whereExists(
                sql("user_purchases")
                    .where({ user_fk: user_fk, user_purchase_id: props.user_purchase_fk })
            )
            modify && builder.modify(modify)
        })
    }


    static async selectDetailed<T extends UserPurchaseProductKeys = UserPurchaseProductKeys>(
        props: UserPurchaseProductPartial = {},
        modify?: APP.ModifySQL<Pick<UserPurchaseProductRequired, T>>) {
        return this.select<T>(props, (builder) => {
            builder.innerJoin("products as p", "p.product_id", "upp.product_fk")
                .innerJoin("colors as c", "c.color_id", "upp.color_fk")
                .innerJoin("sizes as s", "s.size_id", "upp.size_fk")

            modify && builder.modify(modify)
        })
    }

    static async selectDetailedForUser<T extends UserPurchaseProductKeys = UserPurchaseProductKeys>(
        { user_fk, ...props }: { user_fk: DatabaseKeySchema } & UserPurchaseProductPartial,
        modify?: APP.ModifySQL<Pick<UserPurchaseProductRequired, T>>
    ) {
        return this.selectDetailed<T>(props, (builder) => {
            builder.whereExists(
                sql("user_purchases")
                    .where({ user_fk: user_fk, user_purchase_id: props.user_purchase_fk })
            )
            modify && builder.modify(modify)
        })
    }

    static async insert<T extends UserPurchaseProductSchema.Insert>(
        props: Exact<T, UserPurchaseProductSchema.Insert>,
        tsx: Knex<any> = sql
    ) {
        const { color_fk, product_fk, size_fk, user_purchase_fk, quantity } = props
        try {
            /**
             * Solo se inserta a la base datos si el product,color y tamño estan relacionados.
             * Ademas de tener status y stock en true.
             */
            const query = tsx.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_purchase_products (product_fk,user_purchase_fk,color_fk,size_fk,quantity,price,discount)
                SELECT ?,?,?,?,?,p.price,p.discount FROM
                products p
                INNER JOIN product_colors pc ON pc.product_fk = p.product_id 
                INNER JOIN product_color_sizes pcs ON pcs.product_color_fk = pc.product_color_id  
                WHERE p.product_id = ? AND 
                p.status = true AND 
                pc.color_fk = ? AND  
                pcs.size_fk = ? AND
                pcs.stock = true  
                `, [
                product_fk,
                user_purchase_fk,
                color_fk,
                size_fk,
                quantity,
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