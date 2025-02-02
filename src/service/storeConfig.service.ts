import { storeConfigSchema, StoreConfigSchema } from "clothing-store-shared/schema";
import StoreConfigModel from "../model/storeConfig.model";
import zodParse from "../helper/zodParse.helper";
import ErrorHandler from "../utils/errorHandler.utilts";
class StoreConfigService {

    static async createConfig(props: StoreConfigSchema.Insert) {
        const parse = zodParse(storeConfigSchema.insert)(props)
        await StoreConfigModel.insert(parse)
        return parse
    }
    static async updateConfig(props: StoreConfigSchema.Update) {
        const parse = zodParse(storeConfigSchema.update)(props)
        await StoreConfigModel.update(parse)
        return parse
    }
    static async getConfig() {
        const [res] = await StoreConfigModel.select()
        if (!res) throw new ErrorHandler({
            message: "Configuración de la tienda no encontrada.",
            code: "store_config_not_found",
            status: 404
        })
        return res
    }
}

export default StoreConfigService