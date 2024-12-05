import zodParse from "../helper/zodParse.helper.js";
import ProductColorsModel from "../model/productColors.model.js";
import { ProductColorSchema,productColorSchema } from "clothing-store-shared/schema";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorsService extends ServiceUtils {

    static async update(productColors: Array<ProductColorSchema.Update>) {
        const data = zodParse(productColorSchema.update.array().min(1))(productColors);
        const res =  await this.writeOperationsHandler(data, 
            (e) => ProductColorsModel.update(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "el color", action: "actualizar" })
            }
        )

        res("product_colors_update")
    }

    static async delete(productColors: Array<ProductColorSchema.Delete>) {
        const data = zodParse(productColorSchema.delete.array().min(1))(productColors);
        const res =  await this.writeOperationsHandler(data, 
            (e) => ProductColorsModel.delete(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "el color", action: "eliminar" })
            }
        )
        res("product_colors_delete")
    }
    
    static async insert(productColors: Array<ProductColorSchema.Insert>) {
        const data = zodParse(productColorSchema.insert.array().min(1))(productColors);
        const res =  await this.writeOperationsHandler(data, (e) => ProductColorsModel.insert(e))
        res("product_colors_insert")
    }
}

export default ProductColorsService