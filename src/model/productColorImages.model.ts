import sql from "../config/knex.config.js"
import { ProductColorImageSchema } from "../schema/productColorImage.schema.js"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type ProductColorImageKeys = keyof ProductColorImageSchema.Base
type ProductColorImagePartial = Partial<ProductColorImageSchema.Base>
class ProductColorImagesModel extends ModelUtils {

    static async select<T extends ProductColorImageKeys = ProductColorImageKeys>(props: ProductColorImagePartial = {}, modify?: APP.ModifySQL<Pick<ProductColorImagePartial, T>>) {
        try {
            const query = sql<Pick<ProductColorImagePartial, T>>("product_color_images ")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert<T extends ProductColorImageSchema.Insert>
        (colorImage: Exact<T, ProductColorImageSchema.Insert>) {
        try {
            return await sql("product_color_images")
                .insert(colorImage)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update<T extends ProductColorImageSchema.Update>
        ({ product_color_image_id, ...colorImage }: Exact<T, ProductColorImageSchema.Update>) {
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
