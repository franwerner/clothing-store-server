import { NextFunction, Request, Response } from "express";
import ProductColorsModel, { ProductColor } from "../model/productColors.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

type ProductColorBody = {
    colors: Array<ProductColor>
}

class ProductColorsController {
    static async setProductColors(req: Request<any, any, ProductColorBody>, res: Response, next: NextFunction) {

        try {
            const { colors } = req.body
            const data = await ProductColorsModel.insert(colors)

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

    static async modifyProductColors(req: Request<any, any, ProductColorBody>, res: Response, next: NextFunction) {
        try {
            const { colors } = req.body
            
            const data = await Promise.all(
                colors.map(i => ProductColorsModel.update(i))
            )
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

    static async removeProductColors(req: Request<any, any, { colors: Array<number> }>, res: Response, next: NextFunction) {
        try {
            const { colors } = req.body
            const data = await ProductColorsModel.delete(colors)
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


export default ProductColorsController