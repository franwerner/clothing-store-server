import { CategorySchema } from "clothing-store-shared/schema"
import sql from "@/config/knex.config.js"
import ModelUtils from "@/utils/model.utils.js"

type CategoryPartial = Partial<CategorySchema.Base>

class CategoriesModel extends ModelUtils {

    static async select(
        props: CategoryPartial = {},
        modify?: APP.ModifySQL) {
        try {
            const query = sql("categories as c")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: CategorySchema.Insert) {
        try {
            return await sql("categories")
                .insert(props)
        } catch (error) {
            throw this.generateError(error, {
                "ER_NO_REFERENCED_ROW_2": "La marca que intentas referenciar con la categoria no existe."
            })
        }
    }

    static async update({ category_id, ...category }: CategorySchema.Update) {
        try {
            return await sql("categories")
                .update(category)
                .where("category_id", category_id)
        } catch (error) {
            throw this.generateError(error, {
                "ER_NO_REFERENCED_ROW_2": "La marca que intentas referenciar con la categoria no existe."
            })
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