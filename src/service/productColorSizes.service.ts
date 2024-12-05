import { ProductColorSizeSchema,productColorSizeSchema } from "clothing-store-shared/schema"
import zodParse from "../helper/zodParse.helper.js"
import ProductColorSizesModel from "../model/productColorSizes.model.js"
import ServiceUtils from "../utils/service.utils.js"

class ProductColorSizesService extends ServiceUtils {

    static async insert(sizes: Array<ProductColorSizeSchema.Insert>) {
        const data = zodParse(productColorSizeSchema.insert.array().min(1))(sizes)
        const res=   await this.writeOperationsHandler(data, (e) => ProductColorSizesModel.insert(e))
        res("product_color_sizes_insert")
    }

    static async update(sizes: Array<ProductColorSizeSchema.Update>) {
        const data = zodParse(productColorSizeSchema.update.array().min(1))(sizes)
        const res =  await this.writeOperationsHandler(data, 
            (e) => ProductColorSizesModel.update(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "el tamaño", action: "actualizar" })

            }
        )
        res("product_color_sizes_update")
    }

    
    static async updateByProductColor(productColors: Array<ProductColorSizeSchema.UpdateByProductColor>) {
        const data = zodParse(productColorSizeSchema.updateByProductColor.array().min(1))(productColors)
        const res =  await this.writeOperationsHandler(data,
            (e) => ProductColorSizesModel.updatetByProductColor(e),
            (e) => {
                    if (!e) throw this.genericMessage({ text: "el tamaño", action: "actualizar" })
            }
        )
        res("product_color_sizes_update_by")
    }

    static async delete(sizes: Array<ProductColorSizeSchema.Delete>) {
        const data = zodParse(productColorSizeSchema.delete.array().min(1))(sizes)
        const res =  await this.writeOperationsHandler(data, 
            (e) => ProductColorSizesModel.delete(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "el tamaño", action: "eliminar" })
            }
        )
        res("product_color_sizes_delete")
    }
}

export default ProductColorSizesService