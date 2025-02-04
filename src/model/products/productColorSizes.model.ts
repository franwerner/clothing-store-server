import { ProductColorSizeSchema } from "clothing-store-shared/schema"
import sql from "@/config/knex.config.js"
import ModelUtils from "@/utils/model.utils.js"


type ProductColorSizePartial = Partial<ProductColorSizeSchema.Base>


class ProductColorSizesModel extends ModelUtils {

    static async select(
        props: ProductColorSizePartial = {},
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("product_color_sizes as pcs")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectJoinSize(
        props?: ProductColorSizePartial,
        modify?: APP.ModifySQL
    ) {
        return this.select(props, (builder) => {
            modify && builder.modify(modify)
            builder.leftJoin("sizes as s", "s.size_id", "pcs.size_fk")
        })
    }

    static async updatetByProductColor(
        { product_color_fk, ...props }: ProductColorSizeSchema.UpdateByProductColor
    ) {
        try {
            return await sql("product_color_sizes").
                where({ product_color_fk })
                .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(size: ProductColorSizeSchema.Insert ) {
        try {
            return await sql("product_color_sizes")
                .insert(size)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_color_size_id, ...size }: ProductColorSizeSchema.Update) {
        try {
            return await sql("product_color_sizes")
                .update(size)
                .where("product_color_size_id", product_color_size_id);
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(product_color_size_ids: ProductColorSizeSchema.Delete) {
        try {
            return await sql("product_color_sizes")
                .where("product_color_size_id", product_color_size_ids)
                .delete()
        } catch (error) {
            throw this.generateError(error);
        }
    }

}

export default ProductColorSizesModel