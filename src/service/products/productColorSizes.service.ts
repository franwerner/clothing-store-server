import { ProductColorSizeSchema, productColorSizeSchema } from "clothing-store-shared/schema"
import zodParse from "@/helper/zodParse.helper.js"
import ServiceUtils from "@/utils/service.utils.js"
import ProductColorSizesModel from "@/model/products/productColorSizes.model.js"

class ProductColorSizesService extends ServiceUtils {

    static async insert(sizes: Array<ProductColorSizeSchema.Insert>) {
        const data = zodParse(productColorSizeSchema.insert.array().min(1))(sizes)
        await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.insert(e))
    }

    static async update(sizes: Array<ProductColorSizeSchema.Update>) {
        const data = zodParse(productColorSizeSchema.update.array().min(1))(sizes)
        await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.update(e))
    }

    static async updateByProductColor(productColors: Array<ProductColorSizeSchema.UpdateByProductColor>) {
        const data = zodParse(productColorSizeSchema.updateByProductColor.array().min(1))(productColors)
        await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.updatetByProductColor(e))
    }

    static async delete(sizes: Array<ProductColorSizeSchema.Delete>) {
        const data = zodParse(productColorSizeSchema.delete.array().min(1))(sizes)
        await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.delete(e))
    }
}

export default ProductColorSizesService