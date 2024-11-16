import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"
import { Brand } from "./brands.model.js"
import { Category } from "./categories.model.js"
import ProductsModel from "./products.model.js"


class CategoriesRecomendationsModel extends ModelUtils {

    static async randomRecomendation({ limit }: { limit: number }) {

        try {
            const subQueryCategoriesPerBrand = sql("categories")
                .select(
                    "*",
                    sql.raw('ROW_NUMBER() OVER (PARTITION BY brand_fk ORDER BY RAND()) AS row_num')
                )
                .whereExists(
                    ProductsModel.select().select("category_fk")
                        .whereRaw("p.category_fk = category_id")
                        .where("status", true)
                ).where("status", true)

            const query = sql<Brand>("brands as b")
                .select("brand", "category", "brand_id", "category_id")
                .innerJoin<Category & { row_numb: number }>(subQueryCategoriesPerBrand.as("c"), (c) => {
                    c.on("c.brand_fk", "b.brand_id")
                })
                .where("c.row_num", 1)
                .where("b.status", true)
                .limit(limit)

            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }


}


export default CategoriesRecomendationsModel