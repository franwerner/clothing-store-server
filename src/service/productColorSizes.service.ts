import ProductColorSizesModel from "../model/productSizes.model.js"
import productColorSizeSchema, { ProductColorSizeSchema } from "../schema/productColorSize.schema.js"
import ServiceUtils from "../utils/service.utils.js"

class ProductColorSizesService extends ServiceUtils {

    static async insert(sizes: Array<ProductColorSizeSchema.Insert>) {
        const data = productColorSizeSchema.insert.array().parse(sizes)
        return await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.insert(e))
    }

    static async update(sizes: Array<ProductColorSizeSchema.Update>) {
        const data = productColorSizeSchema.update.array().parse(sizes)
        return await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.update(e))
    }

    static async delete(sizes: Array<ProductColorSizeSchema.Delete>) {
        const data = productColorSizeSchema.delete.array().parse(sizes)
        return await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.delete(e))
    }
}

export default ProductColorSizesService