import { NextFunction, Request } from "express"
import ErrorHandler from "../utils/errorHandler.utilts"
import StoreConfigService from "../service/storeConfig.service"

class StoreConfigController {

    static async getConfig(
        _: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = await StoreConfigService.getConfig()
            res.json({
                data,
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
    static async createConfig(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = StoreConfigService.createConfig(req.body)
            res.json({
                data,
                message: "Configuracion creada exitosamente"
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
    static async updateConfig(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = StoreConfigService.updateConfig(req.body)
            res.json({
                data,
                message: "Cambios aplicados exitosamente"
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
}

export default StoreConfigController