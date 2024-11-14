import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Brand {
    brand_id: KEYDB,
    brand: string
    status: boolean
}

type SelectProps = Partial<Brand>
class BrandsModel extends ModelUtils {

    static select(props: SelectProps = {}) {
        return sql("brands as b")
        .where(this.removePropertiesUndefined(props))
    }

    static insert(props: Brand | Array<Brand>) {
        return sql("brands").insert(props)
    }

    static update({ brand_id, ...brand }: Brand) {
        return sql("brands")
            .update(brand)
            .where("brand_id", brand_id)
    }

    static delete(brandIDs: Array<KEYDB>) {
        return sql("brands")
            .whereIn("brand_id", brandIDs)
            .delete()
    }

}
export {
    type Brand
}
export default BrandsModel