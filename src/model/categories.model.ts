import sql from "../database/index.js"
import ModelUtils from "../utils/model.utils.js"

interface Category {
    category: string
    status: boolean
    category_id: KEYDB
    brand_fk: KEYDB
}

type SelectProps = Partial<Category>
class CategoriesModel extends ModelUtils {

    static select(props: SelectProps = {}) {
        return sql("categories")
            .where(this.removePropertiesUndefined(props))
    }
    static insert(props: Category | Array<Category>) {
        return sql("categories")
            .insert(props)
    }

    static update({ category_id, ...category }: Category) {
        return sql("categories")
            .update(category)
            .where("category_id", category_id)
    }

    static delete(categorieIDs: Array<KEYDB>) {
        return sql("categories")
            .whereIn("category_id", categorieIDs)
            .delete()
    }

}


export {
    type Category
}
export default CategoriesModel