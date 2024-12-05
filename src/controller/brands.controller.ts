import { NextFunction, Request } from "express";
import { BrandSchema } from "clothing-store-shared/schema";
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await BrandsService.insert(req.body)
            res.json({
                message: "Todas las marcas agregadas modificas exitosamente."
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await BrandsService.update(req.body)

            res.json({
                message: "Todas las marcas fueron modificas exitosamente."
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await BrandsService.delete(req.body)
            res.json({
                message: "Todas las marcas fueron modificas exitosamente."
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
