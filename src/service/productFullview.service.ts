import ProductColorImagesModel from "../model/productColorImages.model.js"
import ProductColorsModel from "../model/productColors.model.js"
import ProductsModel from "../model/products.model.js"
import ProductColorSizesModel from "../model/productColorSizes.model.js"
import { DatabaseKeySchema } from "../schema/databaseKey.schema.js"
import { ProductColorSchema } from "../schema/productColor.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

class ProductFullViewService {

    static async getProduct(product_id: DatabaseKeySchema) {
        const [product] = await ProductsModel.selectExistsColors({ product_id, status: true })
        if(!product) throw new ErrorHandler({
            message : "Product no encontrado.",
            code : "product_not_found"
        })
        return product
    }


    static async getProductColors(product_fk: DatabaseKeySchema) {
        const productColorModel = await ProductColorsModel.selectExistsSizes({ product_fk })
        if(productColorModel.length === 0) throw new ErrorHandler({
            message : "No se encontro ningun color asociado al producto",
            code : "product_colors_not_found"
        })
        return productColorModel
    }

    static async getProductColorSize(product_color_fk: DatabaseKeySchema){
        const color_sizes = await ProductColorSizesModel.selectJoinSize({ product_color_fk })
        return [color_sizes]
    }

    static async getProductColorImage(product_color_fk: DatabaseKeySchema) {
        const color_images = await ProductColorImagesModel.select({ product_color_fk })
        return color_images
    }

    static async groupByColor(colors: Array<ProductColorSchema.Base>) {
        return await Promise.all(
            colors.map(async (i) => {
                const product_color_id = i.product_color_id
                const color_images = await this.getProductColorImage(product_color_id)
                const color_sizes = await this.getProductColorSize(product_color_id)
                return {
                    color: i,
                    color_images,
                    color_sizes,
                }
            }))
    }

    static async main(product_id: DatabaseKeySchema) {
        const product = await this.getProduct(product_id)
        const colors = await this.getProductColors(product.product_id)
        const groupByColor = await this.groupByColor(colors)
        return {
            product,
            colors: groupByColor
        }
    }
}


export default ProductFullViewService