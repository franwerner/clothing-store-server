import sql from "../config/knex.config.js"
import BrandsModel from "./brands.model.js"
import ProductsModel from "./products.model.js"


class CategoriesRecomendationsModel {

    static randomRecomendation({limit}:{limit : number}) {

        const subQueryCategoriesPerBrand = sql("categories")
            .select(
                "*",
                sql.raw('ROW_NUMBER() OVER (PARTITION BY brand_fk ORDER BY RAND()) AS row_num')
            )
            .whereExists(
               ProductsModel.select().select("category_fk")
               .whereRaw("p.category_fk = category_id")
               .where("status",true)
            ).where("status",true)

            const query =  BrandsModel.select()
            .innerJoin(subQueryCategoriesPerBrand.as("c"), (c) => {
                c.on("c.brand_fk", "b.brand_id")
            })
            .where("c.row_num", 1)
            .where("b.status",true)
            .limit(limit)
            
            return query
    }


}


export default CategoriesRecomendationsModel