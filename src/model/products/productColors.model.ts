import { ProductColorSchema } from "clothing-store-shared/schema"
import sql from "../../config/knex.config.js"
import ModelUtils from "../../utils/model.utils.js"


type ProductColorPartial = Partial<ProductColorSchema.Base>

class ProductColorsModel extends ModelUtils {
    static async select(
        props: ProductColorPartial = {},
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("product_colors as pc")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(productColor: ProductColorSchema.Insert) {
        try {
            return await sql("product_colors")
                .insert(productColor)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_color_id, ...productColor }: ProductColorSchema.Update) {
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
                .where({ productColorID })
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectJoinColor(
        props?: ProductColorPartial,
        modify?: APP.ModifySQL) {
        return this.select(props, (builder) => {
            modify && builder.modify(modify)
            builder
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
        })
    }

    static selectExistsSizes(
        props?: ProductColorPartial,
        modify?: APP.ModifySQL
    ) {
        return this.selectJoinColor(props, (builder) => {
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