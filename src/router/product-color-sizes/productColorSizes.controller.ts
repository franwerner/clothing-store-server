import { NextFunction, Request } from "express"
import ProductColorSizesService from "@/service/products/productColorSizes.service.js"
import ErrorHandler from "@/utils/errorHandler.utilts.js"

class ProductColorSizesController {
    static async setProductColorSizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductColorSizesService.insert(req.body)
            res.json({
                message: "Tamaños de los colores agregados exitosamente.",

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

    static async updateByProductColor(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            await ProductColorSizesService.updateByProductColor(req.body)

            res.json({
                message: "Tamaños de los colores modificado  exitosamente.",
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

    static async modifyProductColorSizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductColorSizesService.update(req.body)
            res.json({
                message: "Tamaños de los colores modificado  exitosamente.",

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

    static async removeProductColorSizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductColorSizesService.delete(req.body)
            res.json({
                message: "Tamaños de los colores eliminados exitosamente.",
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

export default ProductColorSizesController