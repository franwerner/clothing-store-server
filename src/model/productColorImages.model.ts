import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface ProductColorImage {
    product_color_image_id: KEYDB
    product_color_fk: KEYDB
    url: string
}

type SelectProps = Partial<ProductColorImage>

class ProductColorImagesModel extends ModelUtils {

    static select(props: SelectProps = {}) {
        return sql("product_color_images ")
            .where(this.removePropertiesUndefined(props))
    }
    static insert(colorImage: ProductColorImage | Array<ProductColorImage>) {
        return sql("product_color_images")
            .insert(colorImage)
    }

    static update({ product_color_image_id, ...colorImage }: ProductColorImage) {
        return sql("product_color_images")
            .update(colorImage)
            .where("product_color_image_id", product_color_image_id)
    }

    static delete(product_color_image_id: Array<KEYDB>) {
        return sql("product_color_images")
            .whereIn("product_color_image_id", product_color_image_id)
            .delete()
    }



}

export {
    type ProductColorImage
}
export default ProductColorImagesModel
