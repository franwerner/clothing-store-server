import zodParse from "../helper/zodParse.helper.js";
import ProductColorsModel from "../model/productColors.model.js";
import ProductColorSizesModel from "../model/productColorSizes.model.js";
import productColorSchema, { ProductColorSchema } from "../schema/productColor.schema.js";
import productColorSizeSchema, { ProductColorSizeSchema } from "../schema/productColorSize.schema.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ServiceUtils from "../utils/service.utils.js";

class ProductColorsService extends ServiceUtils {

    static async update(productColors: Array<ProductColorSchema.Update>) {
        const data = zodParse(productColorSchema.update.array())(productColors);
        return await this.writeOperationsHandler(data, 
            (e) => ProductColorsModel.update(e),
            (e) => {
                if(!e) throw new ErrorHandler({
                    message : "Al parecer el color que intentar actualizar no existe."
                })
            }
        )
    }


    static async delete(productColors: Array<ProductColorSchema.Delete>) {
        const data = zodParse(productColorSchema.delete.array())(productColors);
        return await this.writeOperationsHandler(data, 
            (e) => ProductColorsModel.delete(e),
            (e) => {
                if(!e) throw new ErrorHandler({
                    message : "Al parecer el color que intentar eliminar no existe."
                })
            }
        )
    }

    static async insert(productColors: Array<ProductColorSchema.Insert>) {
        const data = zodParse(productColorSchema.insert.array())(productColors);
        return await this.writeOperationsHandler(data, (e) => ProductColorsModel.insert(e))
    }
}

export default ProductColorsService