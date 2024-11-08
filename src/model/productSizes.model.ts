import sql from "../database/index.js"

interface ProductColorSize {
    product_color_size_id: number
    product_color_fk: number
    size_fk: number
    stock: boolean,
}


class ProductColorSizesModel {

    static insert(size: ProductColorSize | ProductColorSize[]) {
        return sql("product_color_sizes")
            .insert(size)
    }
    static update({ product_color_size_id, ...size }: ProductColorSize) {
        return sql("product_color_sizes")
            .update(size)
            .where("product_color_size_id", product_color_size_id)

    }

    static delete(product_color_size_ids: Array<number>) {
        return sql("product_color_sizes")
            .whereIn("product_color_size_id", product_color_size_ids)
            .delete()
    }

    static select({ product_color_fk }: { product_color_fk: string | number }) {
        const query = sql("product_color_sizes as pcs")
            .leftJoin("sizes as s", "s.size_id", "pcs.size_fk")
            .where("product_color_fk", product_color_fk)
        return query
    }

}

export {
    type ProductColorSize
}
export default ProductColorSizesModel