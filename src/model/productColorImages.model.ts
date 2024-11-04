import sql from "../database/index.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

interface ProductColorImage {
    product_color_image_id: number
    product_color_fk: number
    url: string
}


class ProductColorImagesModel {

    static async insertColorImage(colorImage: ProductColorImage, connection = sql) {
        try {
            return await connection("product_color_images")
                .insert(colorImage)
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

    static async updateColorImage({ product_color_image_id,...colorImage }: ProductColorImage, connection = sql) {
        try {
            return await connection("product_color_images")
                .update(colorImage)
                .where("product_color_image_id", "=", product_color_image_id)
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
    type ProductColorImage
}
export default ProductColorImagesModel
