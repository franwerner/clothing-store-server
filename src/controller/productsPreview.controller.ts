import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
import generateProductPreviewFilters from "../utils/generateProductPreviewFilters.js"
import ProductsPreviewModel from "../model/productsPreview.model.js"

class ProductsPreviewController {

    static async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const filterParams = generateProductPreviewFilters(req)
            const data = await ProductsPreviewModel.selectProduct(filterParams)
            res.json({
                data,
                status: 200
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

export default ProductsPreviewController