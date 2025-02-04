import sql from "@/config/knex.config"
import ModelUtils from "@/utils/model.utils"
import { CategorySchema,BrandSchema } from "clothing-store-shared/schema"

class CategoriesRecomendationsModel extends ModelUtils {

    static async randomRecomendation({ limit }: { limit: number }) {

        try {
            const subQueryCategoriesPerBrand = sql("categories")
                .select(
                    "*",
                    sql.raw('ROW_NUMBER() OVER (PARTITION BY brand_fk ORDER BY RAND()) AS row_num')
                )
                .whereExists(//Selecciona las categorias si unicamente tienen al menos un producto activo.
                    sql("products as p")
                        .select("category_fk")
                        .whereRaw("p.category_fk = category_id")
                        .where("status", true)
                ).where("status", true)

            const query = sql<BrandSchema.Base>("brands as b")  //Selecciona por MARCA una CATEGORIA al azar y las que cumplen con los criterios de la subquery.
                .select("brand", "category", "brand_id", "category_id")
                .innerJoin<Required<CategorySchema.Base> & { row_numb: number }>(subQueryCategoriesPerBrand.as("c"), (c) => {
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