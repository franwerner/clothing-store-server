import ProductColorsModel from "../model/productColors.model.js";
import productColorSchema, { ProductColorSchema } from "../schema/productColor.schema.js";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorsService extends ServiceUtils {

    static async update(productColors: Array<ProductColorSchema.Update>) {
        const data = productColorSchema.update.array().parse(productColors);
        return await this.writeOperationsHandler(data, (e) => ProductColorsModel.update(e));
    }

    static async delete(productColors: Array<ProductColorSchema.Delete>) {
        const data = productColorSchema.delete.array().parse(productColors);
        return await this.writeOperationsHandler(data, (e) => ProductColorsModel.delete(e));
    }

    static async insert(productColors: Array<ProductColorSchema.Insert>) {
        const data = productColorSchema.insert.array().parse(productColors);
        return await this.writeOperationsHandler(data, (e) => ProductColorsModel.insert(e));
    }
}

export default ProductColorsService