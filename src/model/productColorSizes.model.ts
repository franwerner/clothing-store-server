import sql from "../config/knex.config.js"
import { ProductColorSizeSchema} from "clothing-store-shared/schema"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type ProductColorSizeKeys = keyof ProductColorSizeSchema.Base
type ProductColorSizePartial = Partial<ProductColorSizeSchema.Base>
type ProductColorSizeRequired = Required<ProductColorSizeSchema.Base>

class ProductColorSizesModel extends ModelUtils {

    static async select<T extends ProductColorSizeKeys = ProductColorSizeKeys>(
        props: ProductColorSizePartial = {},
        modify?: APP.ModifySQL<Pick<ProductColorSizeRequired, T>>
    ) {
        try {
            const query = sql<Pick<ProductColorSizeRequired, T>>("product_color_sizes as pcs")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectJoinSize<T extends ProductColorSizeKeys = ProductColorSizeKeys>(
        props?: ProductColorSizePartial,
        modify?: APP.ModifySQL<Pick<ProductColorSizeRequired, T>>
    ) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder.leftJoin("sizes as s", "s.size_id", "pcs.size_fk")
        })
    }

    static async updatetByProductColor<T extends ProductColorSizeSchema.UpdateByProductColor>(
        { product_color_fk, ...props }: Exact<T, ProductColorSizeSchema.UpdateByProductColor>
    ) {
        try {
            return await sql("product_color_sizes").
                where({ product_color_fk })
                .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends ProductColorSizeSchema.Insert>(size: Exact<T, ProductColorSizeSchema.Insert>) {
        try {
            return await sql("product_color_sizes")
                .insert(size)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update<T extends ProductColorSizeSchema.Update>({ product_color_size_id, ...size }: Exact<T, ProductColorSizeSchema.Update>) {
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