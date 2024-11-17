import { NextFunction, Request } from "express"
import { ProductColorImageSchema } from "../schema/productColorImage.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ProductColorImagesService from "../service/productColorImages.service.js"
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js"


class ProductColorImagesController {
    static async addProductColorImages(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorImageSchema.Insert>,
        next: NextFunction
    ) {

        try {
            const data = await ProductColorImagesService.insert(req.body)

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if(ZodErrorHandler.isInstanceOf(error)){
                new ZodErrorHandler(error).response(res)
            }
            else {
                next()
            }
        }
    }

    static async modifyProductColorImages(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorImageSchema.Update>,
        next: NextFunction
    ) {
        try {

            const data = await ProductColorImagesService.update(req.body)
            res.json({
                data
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if(ZodErrorHandler.isInstanceOf(error)){
                new ZodErrorHandler(error).response(res)
            }
            else {
                next()
            }
        }
    }

    static async removeProductColorImages(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorImageSchema.Delete>,
        next: NextFunction) {
        try {
            const data = await ProductColorImagesService.delete(req.body)
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if(ZodErrorHandler.isInstanceOf(error)){
                new ZodErrorHandler(error).response(res)
            }
            else {
                next()
            }
        }
    }
}


export default ProductColorImagesController