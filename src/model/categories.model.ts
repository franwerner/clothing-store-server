import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"
import "../schema/category.schema.js"
import { CategorySchema } from "../schema/category.schema.js"
import Exact from "../types/Exact.types.js"

type CategoryKeys = keyof CategorySchema.Base
type CategoryPartial = Partial<CategorySchema.Base>
type CategoryRequired = Required<CategorySchema.Base>

class CategoriesModel extends ModelUtils {

    static async select<T extends CategoryKeys = CategoryKeys>(props: CategoryPartial = {}, modify?: APP.ModifySQL<Pick<CategoryRequired, T>>) {
        try {
            const query = sql<Pick<CategoryRequired, T>>("categories as c")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends CategorySchema.Insert>(props: Exact<T, CategorySchema.Insert>) {
        try {
            return await sql("categories")
                .insert(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update<T extends CategorySchema.Update>({ category_id, ...category }: Exact<T, CategorySchema.Update>) {
        try {
            return await sql("categories")
                .update(category)
                .where("category_id", category_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(categoryID: CategorySchema.Delete) {
        try {
            return await sql("categories")
                .where("category_id", categoryID)
                .delete()
        } catch (error) {
            throw this.generateError(error, {
                ER_ROW_IS_REFERENCED_2: "No se puede eliminar la categoria porque existen productos asociados a la lista de compras de usuarios."
            })
        }
    }
}


export default CategoriesModel