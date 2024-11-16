import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"
interface Product {
    product_id: KEYDB
    category_fk: KEYDB,
    product: string,
    discount?: number,
    price: number,
    status?: boolean
}

type ProductKeys = keyof Product
type ProductPartial = Partial<Product>
type ProductRequerid = Required<Product>
type ProductInsert = Omit<Product, "product_id">
type ProductUpdate = ProductPartial & { product_id: KEYDB }

class ProductsModel extends ModelUtils {

    static async select<T extends ProductKeys = ProductKeys>(
        props: ProductPartial = {},
        modify?: ModifySQL<Pick<ProductRequerid, T>>
    ) {
        try {
            const query = sql<Pick<ProductRequerid, T>>("products as p")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectExistsColors<T extends ProductKeys = ProductKeys>(
        props?: ProductPartial,
        modify?: ModifySQL<Pick<ProductRequerid, T>>
    ) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder.whereExists(
                sql("product_colors as pc")
                    .whereRaw("pc.product_fk = p.product_id")
            )
        })
    }

    static async insert(product: Array<ProductInsert> | ProductInsert) {
        try {
            return await sql("products")
                .insert(product)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_id, ...props }: ProductUpdate) {
        try {
            return await sql("products")
                .update(props)
                .where("product_id", product_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(productIDs: Array<KEYDB>) {
        try {
            return await sql("products")
                .whereIn("product_id", productIDs)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }

}
export {
    type Product
}
export default ProductsModel