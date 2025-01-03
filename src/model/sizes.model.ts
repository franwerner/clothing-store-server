import sql from "../config/knex.config.js"
import { SizeSchema } from "clothing-store-shared/schema"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type SizeKeys = keyof SizeSchema.Base
type SizePartial = Partial<SizeSchema.Base>
type SizeRequired = Required<SizeSchema.Base>

class SizesModel extends ModelUtils {
    
    static async select<T extends SizeKeys = SizeKeys>(
        props: SizePartial = {},
        modify?: APP.ModifySQL<Pick<SizeRequired, T>>
    ) {
        try {
            const query = sql<Pick<SizeRequired, T>>("sizes")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends SizeSchema.Insert>(size:Exact<T,SizeSchema.Insert>) {
        try {
            return await sql("sizes")
                .insert(size)
        } catch (error) {
            throw this.generateError(error,{
                ER_DUP_ENTRY : "El tamaño que intentas registrar ya se existe en la base de datos."
            })
        }
    }

   
    static async update<T extends SizeSchema.Update>({ size_id, ...size }: Exact<T,SizeSchema.Update>) {
        try {
            return await sql("sizes")
                .update(size)
                .where("size_id", size_id)
        } catch (error) {
            throw this.generateError(error,{
                ER_DUP_ENTRY : "El nombre del tamaño que intentas actualizar ya existe en la base de datos."
            })
        }
    }

    static async delete(sizesId: SizeSchema.Delete) {
        try {
            return await sql("sizes")
                .where("size_id", sizesId)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default SizesModel