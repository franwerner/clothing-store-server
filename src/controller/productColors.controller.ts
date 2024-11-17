import { NextFunction, Request } from "express";
import { ProductColorSchema } from "../schema/productColor.schema.js";
import ProductColorsService from "../service/productColors.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js";


class ProductColorsController {
    static async setProductColors(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSchema.Insert>,
        next: NextFunction
    ) {

        try {
            const data = await ProductColorsService.insert(req.body)

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

    static async modifyProductColors(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSchema.Update>,
        next: NextFunction
    ) {
        try {
            const data = await ProductColorsService.update(req.body)
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

    static async removeProductColors(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductColorSchema.Delete>, 
        next: NextFunction
    ) {
        try {
            const data = await ProductColorsService.delete(req.body)
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


export default ProductColorsController