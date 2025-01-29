import { NextFunction, Request } from "express"
import store from "@/config/store.config"
import ErrorHandler from "@/utils/errorHandler.utilts"
import errorGlobal from "./errorGlobal.middleware"

const isMaintenance = (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {
    try {
        const config = store.get("config")
        const is_maintenance = false
        const permission = req.session.user_info?.permission
        if (permission === "admin" && is_maintenance || (!is_maintenance && config)) return next()
        throw new ErrorHandler({
            message: "La aplicación está en mantenimiento. Intenta más tarde, por favor.",
            code: "app_maintenance",
            status: 503,
            data: config
        })
    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }
}

export default isMaintenance