import { ProductColorImageSchema, productColorImageSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper.js";
import ProductColorImagesModel from "../model/productColorImages.model.js";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorImagesService extends ServiceUtils {

    static async update(productColorImages: Array<ProductColorImageSchema.Update>) {
        const data = zodParse(productColorImageSchema.update.array().min(1))(productColorImages)
        const res = await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.update(e),
        (e) => {
            if (!e) throw this.genericMessage({ text: "la imagen del color", action: "actualizar" })
        }
    )
        res("product_color_images_update")
    }
    
    static async delete(productColorImages: Array<ProductColorImageSchema.Delete>) {
        const data = zodParse(productColorImageSchema.delete.array().min(1))(productColorImages)
        const res =  await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.delete(e),
        (e) => {
            if (!e) throw this.genericMessage({ text: "la imagen del color", action: "eliminar" })
        }
    )
        res("product_color_images_delete")
    }
    
    static async insert(productColorImages: Array<ProductColorImageSchema.Insert>) {
        const data = zodParse(productColorImageSchema.insert.array().min(1))(productColorImages)
        const res = await this.writeOperationsHandler(data, (e) => ProductColorImagesModel.insert(e))
        res("product_color_images_insert")
    }
}

export default ProductColorImagesService