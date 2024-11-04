import sql from "../database/index.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

interface ProductColorSize {
    product_color_size_id: number
    product_color_fk: number
    size: string
    stock: boolean,
    status: boolean
}


class ProductColorSizesModel {

    static async insertColorSize(size: ProductColorSize, transaction = sql) {
        try {
            return await transaction("product_color_sizes")
                .insert(size)
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }
    static async updateColorSize({ product_color_size_id, product_color_fk, ...size }: ProductColorSize, transaction = sql) {
        if (product_color_fk) throw new ErrorHandler({ status: 422, message: "No puedes modificar la referencia del tamaño a otro color" })
        try {
            return await transaction("product_color_sizes")
                .update(size)
                .where("product_color_size_id", "=", product_color_size_id)
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

}

export {
    type ProductColorSize
}
export default ProductColorSizesModel