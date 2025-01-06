import sql from "../config/knex.config.js"
import { BrandSchema } from "clothing-store-shared/schema"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"

type BrandPartial = Partial<BrandSchema.Base>

class BrandsModel extends ModelUtils {

    static async select(props: BrandPartial = {}) {
        try {
            const query = sql("brands as b")
                .where(props)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends BrandSchema.Insert>(props: Exact<T, BrandSchema.Insert>) {
        try {
            return await sql("brands").insert(props)
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "La marca que intentas registrar ya se existe en la base de datos."
            })
        }
    }

    static async update<T extends BrandSchema.Update>({ brand_id, ...brand }: Exact<T, BrandSchema.Update>) {
        try {
            return await sql("brands")
                .update(brand)
                .where("brand_id", brand_id)
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "El nombre de la marca que intentas registrar ya se existe en la base de datos."
            })

        }
    }

    static async delete(brandID: BrandSchema.Delete) {
        try {
            return await sql("brands")
                .where("brand_id", brandID)
                .delete()
        } catch (error) {
            throw this.generateError(error, {
                ER_ROW_IS_REFERENCED_2: "No se puede eliminar la marca porque existen productos asociados a la lista de compras de usuarios."
            })

        }
    }

}

export default BrandsModel