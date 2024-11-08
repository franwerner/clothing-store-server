import { NextFunction, Request, Response } from "express";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import ProductColorsModel, { ProductColor } from "../model/productColors.model.js";

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
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error.code).response(res)
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
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error.code).response(res)
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
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error.code).response(res)
            }
            else {
                next()
            }
        }
    }
}


export default ProductColorsController