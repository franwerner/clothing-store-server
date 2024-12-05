import sql from "../config/knex.config.js"
import { ProductSchema } from "clothing-store-shared/schema"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type ProductKeys = keyof ProductSchema.Base
type ProductPartial = Partial<ProductSchema.Base>
type ProductRequerid = Required<ProductSchema.Base>


class ProductsModel extends ModelUtils {

    static async select<T extends ProductKeys = ProductKeys>(
        props: ProductPartial = {},
        modify?: APP.ModifySQL<Pick<ProductRequerid, T>>
    ) {
        try {
            const query = sql<Pick<ProductRequerid, T>>("products as p")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectExistsColors<T extends ProductKeys = ProductKeys>(
        props?: ProductPartial,
        modify?: APP.ModifySQL<Pick<ProductRequerid, T>>
    ) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder.whereExists(
                sql("product_colors as pc")
                    .whereRaw("pc.product_fk = p.product_id")
            )
        })
    }

    static async insert<T extends ProductSchema.Update>(product: Exact<T, ProductSchema.Insert>) {
        try {
            return await sql("products")
                .insert(product)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update<T extends ProductSchema.Update>({ product_id, ...props }: Exact<T, ProductSchema.Update>) {
        try {
            return await sql("products")
                .update(props)
                .where("product_id", product_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async updateByCategory<T extends ProductSchema.UpdateByCategory>(
        {category_fk,...props}:Exact<T,ProductSchema.UpdateByCategory>
    ) {
        try {
            return await sql("products")
            .where({category_fk})
            .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(productID: ProductSchema.Delete) {
        try {
            return await sql("products")
                .where("product_id", productID)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }

}

export default ProductsModel