import ProductsModel from "@/model/products/products.model.js"
import ErrorHandler from "@/utils/errorHandler.utilts.js"
import CategoriesRecomendationsModel from "@/model/views/categoriesRecomendations.model.js"

class ProductsRecomendationsService {
    static async getRandomProductRecomendation() {
        const res = await CategoriesRecomendationsModel.randomRecomendation({ limit: 3 })

        if (res.length === 0) throw new ErrorHandler({ 
            message: "No se encontraron categorias para recomendar.",
            status: 404,
            code : "products_recomendations_not_found"
         })

        return await Promise.all(res.map(async i => {
            return {
                ...i,
                products: await ProductsModel.select({ category_fk: i.category_id, status: true })
            }
        }))
    }
}

export default ProductsRecomendationsService