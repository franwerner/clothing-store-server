import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Size {
    size_id: KEYDB,
    size: string,
}
type SizeKeys = keyof Size
type SizePartial = Partial<Size>
type SizeRequired = Required<Size>
type SizeInsert = Omit<Size, "size_id">
type SizeUpdate = SizePartial & { size_id: KEYDB }

class SizesModel extends ModelUtils {
    
    static async select<T extends SizeKeys = SizeKeys>(
        props: SizePartial = {},
        modify?: ModifySQL<Pick<SizeRequired, T>>
    ) {
        try {
            const query = sql<Pick<SizeRequired, T>>("sizes")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(size: SizeInsert | SizeInsert[]) {
        try {
            return await sql("sizes")
                .insert(size)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ size_id, ...size }: SizeUpdate) {
        try {
            return await sql("sizes")
                .update(size)
                .where("size_id", size_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(sizesIds: Array<KEYDB>) {
        try {
            return await sql("sizes")
                .whereIn("size_id", sizesIds)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }
}
export {
    type Size
}
export default SizesModel