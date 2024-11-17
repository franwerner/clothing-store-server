import BrandsModel from "../model/brands.model.js"
import brandSchema, { BrandSchema } from "../schema/brand.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class BrandsService extends ServiceUtils {
    static async get() {
        const brands = await BrandsModel.select()

        if (brands.length === 0) throw new ErrorHandler({
            message: "No se ninguna marca",
            status: 404
        })

        return brands
    }
    static async update(brands: Array<BrandSchema.Update>) {
        const data = brandSchema.update.array().parse(brands)
        return await this.writeOperationsHandler(data, (e) => BrandsModel.update(e))
    }
    static async insert(brands: Array<BrandSchema.Insert>) {
        const data = brandSchema.insert.array().parse(brands)
        return await this.writeOperationsHandler(data, (e) => BrandsModel.insert(e))
    }
    static async delete(brands: Array<BrandSchema.Delete>) {
        const data = brandSchema.delete.array().parse(brands)
        return await this.writeOperationsHandler(data, (e) => BrandsModel.delete(e))
    }
}

export default BrandsService