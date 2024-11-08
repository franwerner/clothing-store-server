import sql from "../database/index.js"

interface ProductColorImage {
    product_color_image_id: number
    product_color_fk: number
    url: string
}


class ProductColorImagesModel {

    static insert(colorImage: ProductColorImage | Array<ProductColorImage>) {
        return sql("product_color_images")
            .insert(colorImage)
    }

    static update({ product_color_image_id, ...colorImage }: ProductColorImage) {
        return sql("product_color_images")
            .update(colorImage)
            .where("product_color_image_id",product_color_image_id)
    }

    static delete(product_color_image_id: Array<number>) {
        return sql("product_color_images")
            .whereIn("product_color_image_id", product_color_image_id)
            .delete()
    }

    static select({ product_color_fk }: { product_color_fk: string | number }) {
        const query = sql("product_color_images ")
            .where("product_color_fk", product_color_fk)
        return query
    }


}

export {
    type ProductColorImage
}
export default ProductColorImagesModel
