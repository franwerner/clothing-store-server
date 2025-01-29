import { NextFunction, Request } from "express"
import ProductColorImagesService from "../service/productColorImages.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"


class ProductColorImagesController {
    static async addProductColorImages(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {

        try {
            await ProductColorImagesService.insert(req.body)

            res.json({
                message: "Imagenes agregadas correctamente.",
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

    static async modifyProductColorImages(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            await ProductColorImagesService.update(req.body)
            res.json({
                message: "Imagenes modificadas correctamente."

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

    static async removeProductColorImages(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction) {
        try {
            await ProductColorImagesService.delete(req.body)
            res.json({
                message: "Imagenes eliminadas correctamente",

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


export default ProductColorImagesController