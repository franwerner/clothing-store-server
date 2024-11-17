import CategoriesModel from "../model/categories.model.js";
import categorySchema, { CategorySchema } from "../schema/category.schema.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ServiceUtils from "../utils/service.utils.js";

class CategoriesService extends ServiceUtils {

    static async get() {
        const categories = await CategoriesModel.select()
        if (categories.length === 0) throw new ErrorHandler({
            message: "No se encontraron categorias.",
            status: 404
        })
        return categories
    }

    static async update(categories: Array<CategorySchema.Update>) {
        const data = categorySchema.update.array().parse(categories)
        return await this.writeOperationsHandler(data, (e) => CategoriesModel.update(e))
    }
    static async insert(categories: Array<CategorySchema.Insert>) {
        const data = categorySchema.insert.array().parse(categories)
        return await this.writeOperationsHandler(data, (e) => CategoriesModel.insert(e))
    }
    static async delete(categories: Array<CategorySchema.Delete>) {
        const data = categorySchema.delete.array().parse(categories)
        return await this.writeOperationsHandler(data, (e) => CategoriesModel.delete(e))
    }

}

export default CategoriesService