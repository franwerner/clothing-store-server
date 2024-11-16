import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface ProductColorImage {
    product_color_image_id: KEYDB
    product_color_fk: KEYDB
    url: string
}

type ProductColorImageKeys = keyof ProductColorImage
type ProductColorImagePartial = Partial<ProductColorImage>
type ProductColorImageUpdate = ProductColorImagePartial & { product_color_image_id: KEYDB }
type ProductColorImageInsert = Omit<ProductColorImage, "product_color_image_id">
class ProductColorImagesModel extends ModelUtils {

    static async select<T extends ProductColorImageKeys = ProductColorImageKeys>(props: ProductColorImagePartial = {}, modify?: ModifySQL<Pick<ProductColorImagePartial, T>>) {
        try {
            const query = sql<Pick<ProductColorImagePartial, T>>("product_color_images ")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(colorImage: ProductColorImageInsert | Array<ProductColorImageInsert>) {
        try {
            return await sql("product_color_images")
                .insert(colorImage)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_color_image_id, ...colorImage }: ProductColorImageUpdate) {
        try {
            return await sql("product_color_images")
                .update(colorImage)
                .where("product_color_image_id", product_color_image_id)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async delete(product_color_image_id: Array<KEYDB>) {
        try {
            return await sql("product_color_images")
                .whereIn("product_color_image_id", product_color_image_id)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }



}

export {
    type ProductColorImage
}
export default ProductColorImagesModel
