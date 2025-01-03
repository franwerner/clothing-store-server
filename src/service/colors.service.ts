import zodParse from "../helper/zodParse.helper.js"
import ColorsModel from "../model/colors.model.js"
import { ColorSchema,colorSchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ColorsService extends ServiceUtils {
    static async get() {
        const res = await ColorsModel.select()

        if (res.length === 0) {
            throw new ErrorHandler({
                message: "No se encontraron colores.",
                status: 404,
                code: "colors_not_found"
            })
        }

        return res

    }
    static async delete(colors: ColorSchema.Delete[]) {
        const data = zodParse(colorSchema.delete.array().min(1))(colors)
        const res = await this.writeOperationsHandler(data,
            (color) => ColorsModel.delete(color),
        )
        res("colors_delete")
    }
    static async insert(colors: ColorSchema.Insert[]) {
        const data = zodParse(colorSchema.insert.array().min(1))(colors)
        const res = await this.writeOperationsHandler(data, (color) => ColorsModel.insert(color))
        res("colors_insert")
    }
    static async update(colors: ColorSchema.Update[]) {
        const data = zodParse(colorSchema.update.array().min(1))(colors)
        const res = await this.writeOperationsHandler(data, (color) => ColorsModel.update(color),
        )
        res("colors_update")
    }
}


export default ColorsService