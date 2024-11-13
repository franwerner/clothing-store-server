import sql from "../database/index.js"
import ModelUtils from "../utils/model.utils.js"

interface Size {
    size_id: KEYDB,
    size: string,
}

type SelectProps = Partial<Size>
class SizesModel extends ModelUtils {
    static select(props: SelectProps = {}) {
        return sql("sizes")
            .where(this.removePropertiesUndefined(props))
    }

    static insert(size: Array<Size> | Size) {
        return sql("sizes")
            .insert(size)
    }

    static update({ size_id, ...size }: Size) {
        return sql("sizes")
            .update(size)
            .where("size_id", size_id)
    }
    static delete(sizesIds: Array<KEYDB>) {
        return sql("sizes")
            .whereIn("size_id", sizesIds)
            .delete()
    }
}

export {
    type Size
}
export default SizesModel