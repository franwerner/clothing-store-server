import zodParse from "../helper/zodParse.helper.js"
import ProductColorSizesModel from "../model/productColorSizes.model.js"
import productColorSizeSchema, { ProductColorSizeSchema } from "../schema/productColorSize.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ProductColorSizesService extends ServiceUtils {

    static async insert(sizes: Array<ProductColorSizeSchema.Insert>) {
        const data = zodParse(productColorSizeSchema.insert.array())(sizes)
        return await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.insert(e))
    }

    static async update(sizes: Array<ProductColorSizeSchema.Update>) {
        const data = zodParse(productColorSizeSchema.update.array())(sizes)
        return await this.writeOperationsHandler(data, 
            (e) => ProductColorSizesModel.update(e),
            (e) => {
                if(!e) throw new ErrorHandler({
                    message : "El tamaño que intentar actualizar no existe."
                })
            }
        )
    }

    
    static async updateByProductColor(productColors: Array<ProductColorSizeSchema.UpdateByProductColor>) {
        const data = zodParse(productColorSizeSchema.updateByProductColor.array())(productColors)
        return await this.writeOperationsHandler(data,
            (e) => ProductColorSizesModel.updatetByProductColor(e),
            (e) => {
                if (!e) throw new ErrorHandler({
                    message: `Al parecer el color que intentas actualizar no existe.`,
                })
            }
        )
    }

    static async delete(sizes: Array<ProductColorSizeSchema.Delete>) {
        const data = zodParse(productColorSizeSchema.delete.array())(sizes)
        return await this.writeOperationsHandler(data, 
            (e) => ProductColorSizesModel.delete(e),
            (e) => {
                if(!e) throw new ErrorHandler({
                    message : "El tamaño que intenta eliminar no existe."
                })
            }
        )
    }
}

export default ProductColorSizesService