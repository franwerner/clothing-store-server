import { ProductSchema } from "clothing-store-shared/schema"
import sql from "../config/knex.config.js"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"

type ProductPartial = Partial<ProductSchema.Base>

class ProductsModel extends ModelUtils {

    static async select(
        props: ProductPartial = {},
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("products as p")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectByBrandAndCategory(
        { brand, category, ...props }: ProductPartial & { brand: string, category: string },
        modify?: APP.ModifySQL
    ) {
        return this.select(props, (builder) => {
            modify && builder.modify(modify)
            builder.where("p.category_fk",
                sql("brands as b")
                    .select("c.category_id")
                    .innerJoin("categories as c", "c.brand_fk", "b.brand_id")
                    .where("b.brand", brand)
                    .where("c.category", category)
                    .limit(1))
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
        { category_fk, ...props }: Exact<T, ProductSchema.UpdateByCategory>
    ) {
        try {
            return await sql("products")
                .where({ category_fk })
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