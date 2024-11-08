import sql from "../database/index.js"

interface ProductColor {
    product_color_id: number
    color_fk: number
    product_fk: number
}

type selectProps = { product_fk: string | number }

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

    static delete(product_color_ids: Array<number>) {
        return sql("product_colors")
            .whereIn("product_color_id", product_color_ids)
            .delete()
    }

    static select({ product_fk }: selectProps) {
        const query = sql("product_colors as pc")
            .where("pc.product_fk", "=", product_fk)
            .leftJoin("colors as c", "c.color_id", "pc.color_fk")
        return query
    }

    static selectExistsSizes({ product_fk }: selectProps) {
        return this.select({ product_fk })
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