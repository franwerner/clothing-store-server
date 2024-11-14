import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface ProductColorSize {
    product_color_size_id: KEYDB
    product_color_fk: KEYDB
    size_fk: KEYDB
    stock: boolean,
}

type SelectProps = Partial<ProductColorSize>

class ProductColorSizesModel extends ModelUtils {

    static insert(size: ProductColorSize | ProductColorSize[]) {
        return sql("product_color_sizes")
            .insert(size)
    }
    static update({ product_color_size_id, ...size }: ProductColorSize) {
        return sql("product_color_sizes")
            .update(size)
            .where("product_color_size_id", product_color_size_id)

    }

    static delete(product_color_size_ids: Array<KEYDB>) {
        return sql("product_color_sizes")
            .whereIn("product_color_size_id", product_color_size_ids)
            .delete()
    }

    static select(props: SelectProps = {}) {
        return sql("product_color_sizes as pcs")
            .where(this.removePropertiesUndefined(props))
    }

    static selectWithTableSize(props: SelectProps) {
        return this.select(props)
            .leftJoin("sizes as s", "s.size_id", "pcs.size_fk")
    }

}

export {
    type ProductColorSize
}
export default ProductColorSizesModel