import { CategorySchema, categorySchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper.js";
import CategoriesModel from "../model/categories.model.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ServiceUtils from "../utils/service.utils.js";


class CategoriesService extends ServiceUtils {

    static async getByBrand(brand: string) {
        const categories = await CategoriesModel.selectWithBrand({ brand }, (builder) => builder.select("c.category_id", "c.category"))
        if (categories.length === 0) throw new ErrorHandler({
            message: "No se encontraron categorias.",
            status: 404,
            code: "categories_not_found"
        })
        return categories
    }

    static async update(categories: Array<CategorySchema.Update>) {
        const data = zodParse(categorySchema.update.array().min(1))(categories);
        await this.writeOperationsHandler(data, (e) => CategoriesModel.update(e))
    }
    static async insert(categories: Array<CategorySchema.Insert>) {
        const data = zodParse(categorySchema.insert.array().min(1))(categories)
        await this.writeOperationsHandler(data, (e) => CategoriesModel.insert(e))

    }
    static async delete(categories: Array<CategorySchema.Delete>) {
        const data = zodParse(categorySchema.delete.array().min(1))(categories)
        await this.writeOperationsHandler(data,(e) => CategoriesModel.delete(e))
    }

}

export default CategoriesService