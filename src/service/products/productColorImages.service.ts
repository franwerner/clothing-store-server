import zodParse from "@/helper/zodParse.helper";
import ProductColorImagesModel from "@/model/products/productColorImages.model";
import ServiceUtils from "@/utils/service.utils";
import { DatabaseKeySchema, ProductColorImageSchema, productColorImageSchema } from "clothing-store-shared/schema";

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