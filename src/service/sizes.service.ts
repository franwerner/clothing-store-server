import zodParse from "@/helper/zodParse.helper.js";
import SizesModel from "@/model/sizes.model.js";
import { SizeSchema, sizeSchema } from "clothing-store-shared/schema";
import ErrorHandler from "@/utils/errorHandler.utilts.js";
import ServiceUtils from "@/utils/service.utils.js";

class SizeService extends ServiceUtils {
    static async get() {
        const sizes = await SizesModel.select();
        if (sizes.length === 0) {
            throw new ErrorHandler({
                message: "No se encontraron tamaños",
                status: 404,
                code: "size_not_found"
            })
        }
        return sizes
    }

    static async update(sizes: Array<SizeSchema.Update>) {
        const data = zodParse(sizeSchema.update.array())(sizes)
        await this.writeOperationsHandler(data, (e) => SizesModel.update(e))
    }

    static async insert(sizes: Array<SizeSchema.Insert>) {
        const data = zodParse(sizeSchema.insert.array())(sizes)
        await this.writeOperationsHandler(data, (e) => SizesModel.insert(e))
    }

    static async delete(sizes: Array<SizeSchema.Delete>) {
        const data = zodParse(sizeSchema.delete.array())(sizes)
        await this.writeOperationsHandler(data, (e) => SizesModel.delete(e))

    }
}

export default SizeService;