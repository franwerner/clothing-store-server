import { DatabaseKeySchema, ProductColorImageSchema, productColorImageSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper.js";
import ProductColorImagesModel from "../model/productColorImages.model.js";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorImagesService extends ServiceUtils {

    static async selectOneImageByProductColor(product_color_fk: DatabaseKeySchema) {
        const [image = {}] = await ProductColorImagesModel.select({ product_color_fk }, (builder) => builder.select("url").limit(1))
        return image.url
    }

    static async update(productColorImages: Array<ProductColorImageSchema.Update>) {
        const data = zodParse(productColorImageSchema.update.array().min(1))(productColorImages)
        await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.update(e))
    }

    static async delete(productColorImages: Array<ProductColorImageSchema.Delete>) {
        const data = zodParse(productColorImageSchema.delete.array().min(1))(productColorImages)
        await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.delete(e))
    }

    static async insert(productColorImages: Array<ProductColorImageSchema.Insert>) {
        const data = zodParse(productColorImageSchema.insert.array().min(1))(productColorImages)
        await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.insert(e))
    }
}

export default ProductColorImagesService