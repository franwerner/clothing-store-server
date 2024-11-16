import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Category {
    category_id: KEYDB
    category: string
    brand_fk: KEYDB
    status?: boolean
}

type CategoryKeys = keyof Category
type CategoryPartial = Partial<Category>
type CategoryRequired = Required<Category>
type CategoryInsert = Omit<Category, "category_id">
type CategoryUpdate = CategoryPartial & { category_id: KEYDB }

class CategoriesModel extends ModelUtils {

    static async select<T extends CategoryKeys = CategoryKeys>(props: CategoryPartial = {}, modify?: ModifySQL<Pick<CategoryRequired, T>>) {
        try {
            const query = sql<Pick<CategoryRequired, T>>("categories as c")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: CategoryInsert | Array<CategoryInsert>) {
        try {
            return await sql("categories")
                .insert(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ category_id, ...category }: CategoryUpdate) {
        try {
            return await sql("categories")
                .update(category)
                .where("category_id", category_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(categoryIDs: Array<KEYDB>) {
        try {
            return await sql("categories")
                .whereIn("category_id", categoryIDs)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }
}


export {
    type Category
}
export default CategoriesModel