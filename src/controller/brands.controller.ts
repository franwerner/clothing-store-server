import { NextFunction, Request } from "express";
import { BrandSchema } from "../schema/brand.schema.js";
import BrandsService from "../service/brands.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class BrandsController {

    static async getBrands(
        _: Request,
        res: APP.ResponseTemplate<BrandSchema.Base[]>,
        next: NextFunction
    ) {
        try {
            const data = await BrandsService.get()
            res.json({
                data: data
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

    static async addBrands(
        req: Request,
        res: APP.ResponseTemplateWithWOR<BrandSchema.Insert>,
        next: NextFunction
    ) {
        try {
            const data = await BrandsService.insert(req.body)
            res.json({
                data: data
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

    static async modifyBrands(
        req: Request,
        res: APP.ResponseTemplateWithWOR<BrandSchema.Update>,
        next: NextFunction
    ) {
        try {
            const data = await BrandsService.update(req.body)

            res.json({
                data
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

    static async removeBrands(
        req: Request,
        res: APP.ResponseTemplateWithWOR<BrandSchema.Delete>,
        next: NextFunction
    ) {
        try {
            const data = await BrandsService.delete(req.body)
            res.json({
                data
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


export default BrandsController
