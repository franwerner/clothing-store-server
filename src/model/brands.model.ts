import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Brand {
    brand_id: KEYDB,
    brand: string
    status?: boolean
}
type BrandKeys = keyof Brand
type BrandPartial = Partial<Brand>
type BrandRequired = Required<Brand>
type BrandInsert = Omit<Brand,"brand_id">
type BrandUpdate = BrandPartial & {brand_id : KEYDB}

class BrandsModel extends ModelUtils {

    static async select<T extends BrandKeys = BrandKeys>(props: BrandPartial = {}) {
        try {
            const query = sql<Pick<BrandRequired, T>>("brands as b")
                .where(this.removePropertiesUndefined(props))
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(props: BrandInsert | Array<BrandInsert>) {
        try {
            return await sql("brands").insert(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ brand_id, ...brand }: BrandUpdate) {
        try {
            return await sql("brands")
                .update(brand)
                .where("brand_id", brand_id)
        } catch (error) {
            throw this.generateError(error)

        }
    }

    static async delete(brandIDs: Array<KEYDB>) {
        try {
            return await sql("brands")
                .whereIn("brand_id", brandIDs)
                .delete()
        } catch (error) {
            throw this.generateError(error)

        }
    }

}
export {
    type Brand
}
export default BrandsModel