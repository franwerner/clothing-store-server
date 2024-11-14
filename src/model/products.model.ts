import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Product {
    product_id: KEYDB
    category_fk: KEYDB,
    product: string,
    discount: number,
    price: number,
    status: boolean
}

type SelectProps = Partial<Product>
class ProductsModel extends ModelUtils {

    static insert(product: Array<Product>) {
        return sql("products")
            .insert(product)
    }

    static update({ product_id, ...props }: Product) {
        return sql("products")
            .update(props)
            .where("product_id", "=", product_id)
    }

    static delete(productIDs: Array<KEYDB>) {
        return sql("products")
            .whereIn("product_id", productIDs)
            .delete()
    }

    static select(props: SelectProps = {}) {
        return sql("products as p")
            .where(this.removePropertiesUndefined(props))
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