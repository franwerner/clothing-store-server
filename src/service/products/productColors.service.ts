import { ProductColorSchema, productColorSchema } from "clothing-store-shared/schema";
import zodParse from "@/helper/zodParse.helper.js";
import ProductColorsModel from "@/model/products/productColors.model.js";
import ServiceUtils from "@/utils/service.utils.js";

class ProductColorsService extends ServiceUtils {

    static async update(productColors: Array<ProductColorSchema.Update>) {
        const data = zodParse(productColorSchema.update.array().min(1))(productColors);
        await this.writeOperationsHandler(data,(e) => ProductColorsModel.update(e))
    }

 
    static async delete(productColors: Array<ProductColorSchema.Delete>) {
        const data = zodParse(productColorSchema.delete.array().min(1))(productColors);
        await this.writeOperationsHandler(data,(e) => ProductColorsModel.delete(e))
    }
    
    static async insert(productColors: Array<ProductColorSchema.Insert>) {
        const data = zodParse(productColorSchema.insert.array().min(1))(productColors);
        await this.writeOperationsHandler(data, (e) => ProductColorsModel.insert(e))
    }
}

export default ProductColorsService