import sql from "../database/index.js"

interface Brand {
    brand_id: number,
    brand: string
    status: boolean
}
class BrandsModel {

    static select() {
        return sql("brands")
    }

    static insert(props: Brand | Array<Brand>) {
        return sql("brands").insert(props)
    }

    static update({ brand_id, ...brand }: Brand) {
        return sql("brands")
            .update(brand)
            .where("brand_id", brand_id)
    }

    static delete(brandIDs: Array<number>) {
        return sql("brands")
            .whereIn("brand_id", brandIDs)
            .delete()
    }

}
export {
    type Brand
}
export default BrandsModel