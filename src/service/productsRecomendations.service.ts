import CategoriesRecomendationsModel from "../model/categoriesRecomendations.model.js"
import ProductsModel from "../model/products.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"

class ProductsRecomendationsService {
    static async getRandomProductRecomendation() {
        const res = await CategoriesRecomendationsModel.randomRecomendation({ limit: 3 })

        if (res.length === 0) throw new ErrorHandler({ message: "No se encontraron categorias", status: 404 })

        const products = await Promise.all(res.map(async i => {
            return {
                ...i,
                products: await ProductsModel.select({ category_fk: i.category_id })
            }
        }))

        return products
    }
}

export default ProductsRecomendationsService