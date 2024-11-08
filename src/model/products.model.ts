import sql from "../database/index.js"

interface Product {
    product_id: number
    category_fk: number,
    product: string,
    discount: number,
    price: number,
    status: boolean
}

type SelectProps = { product_id?: string, category_fk?: string, status?: boolean }
class ProductsModel {

    static insert(product: Array<Product>) {
        return sql("products")
            .insert(product)
    }

    static update({ product_id, ...props }: Product) {
        return sql("products")
            .update(props)
            .where("product_id", "=", product_id)
    }

    static delete(productIDs: Array<Number>) {
        return sql("products")
            .whereIn("product_id", productIDs)
            .delete()
    }

    static select({ product_id, category_fk, status }: SelectProps) {
        const query = sql("products as p")
        product_id && query.where("product_id", product_id)
        category_fk && query.where("category_fk", category_fk)
        typeof status === "boolean" && query.where("status", status)
        return query
    }

    static selectExistsColors(props: SelectProps) {
        return this.select(props)
            .whereExists(
                sql("product_colors as pc")
                    .whereRaw("pc.product_fk = p.product_id")
            )
    }

}

export {
    type Product
}
export default ProductsModel