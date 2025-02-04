import ColorsService from "@/service/colors.service.js";
import ErrorHandler from "@/utils/errorHandler.utilts.js";
import { NextFunction, Request } from "express";

class ColorsController {

    static async addColors(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ColorsService.insert(req.body)
            res.json({
                message: "Colores agregados correctamente."
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

    static async modifyColors
        (req: Request,
            res: APP.ResponseTemplate,
            next: NextFunction
        ) {

        try {
            await ColorsService.update(req.body)
            res.json({
                message: "Colores modificados correctamente."
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async removeColors(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ColorsService.delete(req.body)

            res.json({
                message: "Colores eliminados correctamente."
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

    static async getColors(
        _: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const data = await ColorsService.get()
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

}

export default ColorsController