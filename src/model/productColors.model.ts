import sql from "../database/index.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

interface ProductColor {
    product_color_id: number
    color: string
    hexadecimal: string
    product_fk: number
    stauts: boolean
}


class ProductColorsModel {

    static async insertColor(color: ProductColor, connection = sql) {
        try {
            return await connection("product_colors")
                .insert(color)
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

    static async updateColor({ product_color_id, product_fk, ...color }: ProductColor, connection = sql) {
        if (product_fk) throw new ErrorHandler({ status: 422, message: "No puedes modificar la referencia del color a otro producto" })
        try {
            return await connection("product_colors")
                .update(color)
                .where("product_color_id", "=", product_color_id)

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
    type ProductColor,
}
export default ProductColorsModel