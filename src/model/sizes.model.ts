import sql from "../database/index.js"

interface Size {
    size_id: number,
    size: string,
}

class SizesModel {
    static select() {
        return sql("sizes")
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
    static delete(sizesIds: Array<number>) {
        return sql("sizes")
            .whereIn("size_id", sizesIds)
            .delete()
    }
}

export {
    type Size
}
export default SizesModel