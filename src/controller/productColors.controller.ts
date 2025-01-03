import { NextFunction, Request } from "express";
import ProductColorsService from "../service/productColors.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class ProductColorsController {
    static async setProductColors(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {

        try {
            await ProductColorsService.insert(req.body)

            res.json({
                message: "Colores de los productos agregados correctamente.",

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


    static async modifyProductColors(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductColorsService.update(req.body)
            res.json({
                message: "Colores de los productos modificados correctamente.",

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

    static async removeProductColors(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductColorsService.delete(req.body)
            res.json({
                message: "Colores de los productos eliminados correctamente.",

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


export default ProductColorsController