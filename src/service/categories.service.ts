import zodParse from "../helper/zodParse.helper.js";
import CategoriesModel from "../model/categories.model.js";
import { CategorySchema, DatabaseKeySchema, categorySchema } from "clothing-store-shared/schema";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ServiceUtils from "../utils/service.utils.js";

class CategoriesService extends ServiceUtils {

    static async getByBrand(brand_fk: DatabaseKeySchema) {
        const categories = await CategoriesModel.select({ brand_fk })
        if (categories.length === 0) throw new ErrorHandler({
            message: "No se encontraron categorias.",
            status: 404,
            code: "categories_not_found"
        })
        return categories
    }

    static async update(categories: Array<CategorySchema.Update>) {
        const data = zodParse(categorySchema.update.array().min(1))(categories);
        const res = await this.writeOperationsHandler(data, (e) => CategoriesModel.update(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "la categoria", action: "actualizar" })
            }
        )
        res("categories_update")
    }
    static async insert(categories: Array<CategorySchema.Insert>) {
        const data = zodParse(categorySchema.insert.array().min(1))(categories)
        const res = await this.writeOperationsHandler(data, (e) => CategoriesModel.insert(e))
        res("categories_insert")

    }
    static async delete(categories: Array<CategorySchema.Delete>) {
        const data = zodParse(categorySchema.delete.array().min(1))(categories)
        const res = await this.writeOperationsHandler(data,
            (e) => CategoriesModel.delete(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "la categoria", action: "eliminar" })
            }
        )
        res("categories_delete")
    }

}

export default CategoriesService