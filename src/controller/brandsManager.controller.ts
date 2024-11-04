import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ProductBrandsModel, { ProductBrand } from "../model/productBrands.model.js";


class BrandsManagerController {

    static async getBrands(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ProductBrandsModel.selectBrand()
            res.json({
                status: 200,
                data: data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async getBrand(req: Request, res: Response, next: NextFunction) {
        try {
            const { product_brand_id } = req.params
            const data = await ProductBrandsModel.selectBrand({ product_brand_id })
            res.json({
                status: 200,
                data: data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async setBrand(req: Request<any, any, ProductBrand>, res: Response, next: NextFunction) {
        try {
             await ProductBrandsModel.insertBrand(req.body)
            res.json({
                status: 200,
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


export default BrandsManagerController