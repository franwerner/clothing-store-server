import zodParse from "../helper/zodParse.helper.js"
import BrandsModel from "../model/brands.model.js"
import brandSchema, { BrandSchema } from "../schema/brand.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class BrandsService extends ServiceUtils {
    static async get() {
        const brands = await BrandsModel.select()

        if (brands.length === 0) throw new ErrorHandler({
            message: "No se ninguna marca",
            status: 404,
            code: "brands_not_found"
        })

        return brands
    }
    static async update(brands: Array<BrandSchema.Update>) {
        const data = zodParse(brandSchema.update.array().min(1))(brands)
        const res = await this.writeOperationsHandler(data,
            (e) => BrandsModel.update(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "la marca", action: "actualizar" })
            }
        )
        res("brands_update")
    }
    static async insert(brands: Array<BrandSchema.Insert>) {
        const data = zodParse(brandSchema.insert.array().min(1))(brands)
        const res = await this.writeOperationsHandler(data, (e) => BrandsModel.insert(e))
        res("brands_insert")
    }
    static async delete(brands: Array<BrandSchema.Delete>) {
        const data = zodParse(brandSchema.delete.array().min(1))(brands)
        const res = await this.writeOperationsHandler(data,
            (e) => BrandsModel.delete(e),
            (e) => {
                if (!e) throw this.genericMessage({ text: "la marca", action: "eliminar" })
            }
        )
        res("brands_delete")
    }
}

export default BrandsService