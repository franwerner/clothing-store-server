import { NextFunction, Request, Response } from "express";
import BrandsModel, { Brand } from "../model/brands.model.js";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
class BrandsController {

    static async getBrands(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await BrandsModel.select()
            res.json({
                data: data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }
        }
    }

    static async setBrands(req: Request<any, any, { brands: Array<Brand> }>, res: Response, next: NextFunction) {
        try {
            const data = await BrandsModel.insert(req.body.brands)
            res.json({
                data: data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }
        }
    }

    static async modifyBrands(req: Request<any, any, { brands: Array<Brand> }>, res: Response, next: NextFunction) {
        try {
            const brands = req.body.brands
            const data = await Promise.all(brands.map(i => BrandsModel.update(i)))
            res.json({
                data: data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }
        }
    }

    static async removeBrands(req: Request<any, any, { brands: Array<number> }>, res: Response, next: NextFunction) {
        try {
            const brands = req.body.brands
            const data = await BrandsModel.delete(brands)
            res.json({
                data: data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }
        }
    }
}


export default BrandsController