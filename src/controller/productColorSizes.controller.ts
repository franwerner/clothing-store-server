import { NextFunction, Request } from "express"
import { ProductColorSizeSchema } from "../schema/productColorSize.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ProductColorSizesService from "../service/productColorSizes.service.js"
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js"

class ProductColorSizesController {
    static async setProductColorSizes(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSizeSchema.Insert>,
        next: NextFunction
    ) {
        try {
            const data = await ProductColorSizesService.insert(req.body.sizes)
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

    static async modifyProductColorSizes(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSizeSchema.Update>,
        next: NextFunction
    ) {
        try {
            const data = await ProductColorSizesService.update(req.body.sizes)
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

    static async removeProductColorSizes(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSizeSchema.Delete>,
        next: NextFunction
    ) {
        try {
            const data = await ProductColorSizesService.delete(req.body.sizes)
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

export default ProductColorSizesController