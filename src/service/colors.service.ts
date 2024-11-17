import ColorsModel from "../model/colors.model.js"
import colorSchema, { ColorSchema } from "../schema/color.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ColorsService extends ServiceUtils {
    static getHexadecimalPattern() {
        return /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
    }
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
        const data  = colorSchema.delete.array().parse(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.delete(color))
    }
    static async insert(colors: ColorSchema.Insert[]) {
        const data  = colorSchema.insert.array().parse(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.insert(color))
    }
    static async update(colors: ColorSchema.Update[]) {
        const data  = colorSchema.update.array().parse(colors)
        return await this.writeOperationsHandler(data, (color) => ColorsModel.update(color))
    }
}


export default ColorsService