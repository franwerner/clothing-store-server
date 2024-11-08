import sql from "../database/index.js"

interface Category {
    category: string
    status: boolean
    category_id: number
    brand_fk: number
}

class CategoriesModel {

    static select({ brand_fk }: { brand_fk?: string } = {}) {
        const query = sql("categories")
        if (brand_fk) query.where("brand_fk", brand_fk)
        return query

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

    static delete(categorieIDs:Array<Number>){
        return sql("categories")
        .whereIn("category_id",categorieIDs)
        .delete()
    }

}


export {
    type Category
}
export default CategoriesModel