import zodParse from "../helper/zodParse.helper.js"
import ColorsModel from "../model/colors.model.js"
import colorSchema, { ColorSchema } from "../schema/color.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ColorsService extends ServiceUtils {
    static async get(){
        const res = await ColorsModel.select()

        if(res.length === 0){
            throw new ErrorHandler({
                message : "No se encontraron colores.",
                status : 404
            })
        }
     
    }
    static async delete(colors: ColorSchema.Delete[]) {
        const data = zodParse(colorSchema.delete.array())(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.delete(color))
    }
    static async insert(colors: ColorSchema.Insert[]) {
        const data = zodParse(colorSchema.insert.array())(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.insert(color))
    }
    static async update(colors: ColorSchema.Update[]) {
        const data = zodParse(colorSchema.update.array())(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.update(color))
    }
}


export default ColorsService