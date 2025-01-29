import sql from "../config/knex.config.js"
import { ProductColorImageSchema } from "clothing-store-shared/schema"
import ModelUtils from "../utils/model.utils.js"


type ProductColorImagePartial = Partial<ProductColorImageSchema.Base>
class ProductColorImagesModel extends ModelUtils {

    static async select(props: ProductColorImagePartial = {}, modify?: APP.ModifySQL) {
        try {
            const query = sql("product_color_images ")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert
        (colorImage:  ProductColorImageSchema.Insert) {
        try {
            return await sql("product_color_images")
                .insert(colorImage)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update
        ({ product_color_image_id, ...colorImage }: ProductColorImageSchema.Update) {
        try {
            return await sql("product_color_images")
                .update(colorImage)
                .where("product_color_image_id", product_color_image_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(product_color_image_id: ProductColorImageSchema.Delete) {
        try {
            return await sql("product_color_images")
                .where("product_color_image_id", product_color_image_id)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }



}

export default ProductColorImagesModel
