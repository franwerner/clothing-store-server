import SizesModel from "../model/sizes.model.js";
import sizeSchema, { SizeSchema } from "../schema/size.schema.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ServiceUtils from "../utils/service.utils.js";

class SizeService extends ServiceUtils {
    static async get() {
        const sizes = await SizesModel.select();

        if (sizes.length === 0) {
            throw new ErrorHandler({
                message: "No se encontraron tamaños",
                status: 404
            });
        }

        return sizes;
    }

    static async update(sizes: Array<SizeSchema.Update>) {
        const data = sizeSchema.update.array().parse(sizes);
        return await this.writeOperationsHandler(data, (e) => SizesModel.update(e));
    }

    static async insert(sizes: Array<SizeSchema.Insert>) {
        const data = sizeSchema.insert.array().parse(sizes);
        return await this.writeOperationsHandler(data, (e) => SizesModel.insert(e));
    }

    static async delete(sizes: Array<SizeSchema.Delete>) {
        const data = sizeSchema.delete.array().parse(sizes);
        return await this.writeOperationsHandler(data, (e) => SizesModel.delete(e));
    }
}

export default SizeService;