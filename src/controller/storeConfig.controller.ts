import { NextFunction, Request } from "express"
import ErrorHandler from "../utils/errorHandler.utilts"
import StoreConfigService from "../service/storeConfig.service"
import store from "@/config/store.config"

class StoreConfigController {

    static async getConfig(
        _: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = store.ensure("config")
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
            const data = await StoreConfigService.createConfig(req.body)
            store.set("config", data)
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
            const data = await StoreConfigService.updateConfig(req.body)
            store.set("config", { ...store.ensure("config"), ...data })
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