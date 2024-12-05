import sql from "../config/knex.config.js"
import { ProductColorSchema } from "clothing-store-shared/schema"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type ProductColorKeys = keyof ProductColorSchema.Base
type ProductColorPartial = Partial<ProductColorSchema.Base>
type ProductColorRequerid = Required<ProductColorSchema.Base>

class ProductColorsModel extends ModelUtils {
    static async select<T extends ProductColorKeys = ProductColorKeys>(
        props: ProductColorPartial = {},
        modify?: APP.ModifySQL<Pick<ProductColorRequerid, T>>
    ) {
        try {
            const query = sql<Pick<ProductColorRequerid, T>>("product_colors as pc")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends ProductColorSchema.Insert>(productColor: Exact<T, ProductColorSchema.Insert>) {
        try {
            return await sql("product_colors")
                .insert(productColor)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update<T extends ProductColorSchema.Insert>({ product_color_id, ...productColor }: Exact<T, ProductColorSchema.Update>) {
        try {
            return await sql("product_colors")
                .update(productColor)
                .where("product_color_id", product_color_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(productColorID: ProductColorSchema.Delete) {
        try {
            return await sql("product_colors")
                .where("product_color_id", productColorID)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectJoinColor<T extends ProductColorKeys = ProductColorKeys>(
        props?: ProductColorPartial,
        modify?: APP.ModifySQL<Pick<ProductColorRequerid, T>>) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
        })
    }

    static selectExistsSizes<T extends ProductColorKeys = ProductColorKeys>(
        props?: ProductColorPartial,
        modify?: APP.ModifySQL<Pick<ProductColorRequerid, T>>
    ) {
        return this.selectJoinColor<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder
                .whereExists(
                    sql("product_color_sizes")
                        .whereRaw("product_color_fk = pc.product_color_id")
                )
        })
    }
}


export default ProductColorsModel