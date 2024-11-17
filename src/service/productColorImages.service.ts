import ProductColorImagesModel from "../model/productColorImages.model.js";
import productColorImagesSchema, { ProductColorImageSchema } from "../schema/productColorImage.schema.js";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorImagesService extends ServiceUtils {

    static async update(productColorImages:Array<ProductColorImageSchema.Update>) {
        const data = productColorImagesSchema.update.array().parse(productColorImages)
       return await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.update(e))
    }

    static async delete(productColorImages:Array<ProductColorImageSchema.Delete>) {
        const data = productColorImagesSchema.delete.array().parse(productColorImages)
       return await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.delete(e))
    }

    static async insert(productColorImages:Array<ProductColorImageSchema.Insert>) {
        const data = productColorImagesSchema.insert.array().parse(productColorImages)
       return await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.insert(e))
    }
}

export default ProductColorImagesService