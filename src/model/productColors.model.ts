import sql from "../database/index.js"

interface ProductColor {
    product_color_id: KEYDB
    color_fk: KEYDB
    product_fk: KEYDB
}

type SelectProps = Partial<ProductColor>

class ProductColorsModel {

    static insert(color: Array<ProductColor> | ProductColor) {
        return sql("product_colors")
            .insert(color)

    }

    static update({ product_color_id, product_fk, ...color }: ProductColor) {
        return sql("product_colors")
            .update(color)
            .where("product_color_id", "=", product_color_id)
    }

    static delete(product_color_ids: Array<KEYDB>) {
        return sql("product_colors")
            .whereIn("product_color_id", product_color_ids)
            .delete()
    }

    static select(props: SelectProps = {}) {
        return sql("product_colors as pc")
            .where(props)
    }

    static selectWithTableColor(props: SelectProps) {
        return this.select(props)
            .leftJoin("colors as c", "c.color_id", "pc.color_fk")
        
    }

    static selectExistsSizes(props: SelectProps) {
        return this.select(props)
            .whereExists(
                sql("product_color_sizes")
                    .whereRaw("product_color_fk = pc.product_color_id")
            )
    }


}

export {
    type ProductColor
}
export default ProductColorsModel