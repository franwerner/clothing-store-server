import ProductColorImagesModel from "@/model/products/productColorImages.model.js"
import ProductColorsModel from "@/model/products/productColors.model.js"
import { ProductColorSchema, DatabaseKeySchema } from "clothing-store-shared/schema"
import ErrorHandler from "@/utils/errorHandler.utilts.js"
import ProductsModel from "@/model/products/products.model.js"
import ProductColorSizesModel from "@/model/products/productColorSizes.model.js"

interface getProductProps {
    brand: string,
    category: string,
    product: string
}
class ProductFullViewService {
    static async getProduct({ brand, category, product }: getProductProps) {
        const [p] = await ProductsModel.selectByBrandAndCategory(
            { brand, category, product, status: true },
            (builder) => builder.select("product_id", "product", "discount", "price", "create_at")
        )
        if (!p) throw new ErrorHandler({
            message: "Producto no encontrado.",
            code: "product_not_found",
            status: 404
        })
        return p
    }

    static async getProductColors(product_fk: DatabaseKeySchema) {
        const productColorModel = await ProductColorsModel.selectExistsSizes(
            { product_fk },
            (builder) => builder.select("color", "color_id", "product_color_id", "hexadecimal")
        )
        if (productColorModel.length === 0) throw new ErrorHandler({
            message: "No se encontro ningun color asociado al producto",
            code: "product_colors_not_found",
            status: 404
        })
        return productColorModel
    }

    static async getProductColorSize(product_color_fk: DatabaseKeySchema) {
        const color_sizes = await ProductColorSizesModel.selectJoinSize(
            { product_color_fk },
            (builder) => builder.select("size", "stock", "product_color_size_id", "size_id")
        )
        return color_sizes
    }

    static async getProductColorImage(product_color_fk: DatabaseKeySchema) {
        const color_images = await ProductColorImagesModel.select({ product_color_fk }, (builder) => builder.select("url", "product_color_image_id"))
        return color_images
    }

    static async groupByColor(colors: Array<ProductColorSchema.Base>) {
        return await Promise.all(
            colors.map(async (i) => {
                const product_color_id = i.product_color_id
                const images = await this.getProductColorImage(product_color_id)
                const sizes = await this.getProductColorSize(product_color_id)
                return {
                    color: i,
                    images,
                    sizes,
                }
            }))
    }

    static async main(props: getProductProps) {
        const product = await this.getProduct(props)
        const colors = await this.getProductColors(product.product_id)
        const groupByColor = await this.groupByColor(colors)
        return {
            product,
            colors: groupByColor
        }
    }
}


export default ProductFullViewService