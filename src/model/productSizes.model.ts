import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface ProductColorSize {
    product_color_size_id: KEYDB
    product_color_fk: KEYDB
    size_fk: KEYDB
    stock?: boolean,
}
type ProductColorSizeKeys = keyof ProductColorSize
type ProductColorSizePartial = Partial<ProductColorSize>
type ProductColorSizeRequired = Required<ProductColorSize>
type ProductColorSizeInsert = Omit<ProductColorSize, "product_color_size_id">
type ProductColorSizeUpdate = ProductColorSizePartial & { product_color_size_id: KEYDB }

class ProductColorSizesModel extends ModelUtils {

    static async select<T extends ProductColorSizeKeys = ProductColorSizeKeys>(
        props: ProductColorSizePartial = {},
        modify?: ModifySQL<Pick<ProductColorSizeRequired, T>>
    ) {
        try {
            const query = sql<Pick<ProductColorSizeRequired, T>>("product_color_sizes as pcs")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectWithTableSize<T extends ProductColorSizeKeys = ProductColorSizeKeys>(
        props?: ProductColorSizePartial,
        modify?: ModifySQL<Pick<ProductColorSizeRequired, T>>
    ) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder.leftJoin("sizes as s", "s.size_id", "pcs.size_fk")
        })
    }

    static async insert(size: ProductColorSizeInsert | ProductColorSizeInsert[]) {
        try {
            return await sql("product_color_sizes")
                .insert(size)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_color_size_id, ...size }: ProductColorSizeUpdate) {
        try {
            return await sql("product_color_sizes")
                .update(size)
                .where("product_color_size_id", product_color_size_id);
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(product_color_size_ids: Array<KEYDB>) {
        try {
            return await sql("product_color_sizes")
                .whereIn("product_color_size_id", product_color_size_ids)
                .delete()
        } catch (error) {
            throw this.generateError(error);
        }
    }

}
export {
    type ProductColorSize
}
export default ProductColorSizesModel