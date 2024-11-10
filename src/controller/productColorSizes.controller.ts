import { NextFunction, Request, Response } from "express"
import ProductColorSizesModel, { ProductColorSize } from "../model/productSizes.model.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

type ProductColorSizeBody = {
    sizes: Array<ProductColorSize>
}

class ProductColorSizesController {
    static async setProductColorSizes(req: Request<any, any, ProductColorSizeBody>, res: Response, next: NextFunction) {

        try {
            const { sizes } = req.body
            const data = await ProductColorSizesModel.insert(sizes)

            res.json({
                data
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

    static async modifyProductColorSizes(req: Request<any, any, ProductColorSizeBody>, res: Response, next: NextFunction) {
        try {
            const { sizes } = req.body

            const data = await Promise.all(
                sizes.map(i => ProductColorSizesModel.update(i))
            )
            res.json({
                data
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

    static async removeProductColorSizes(req: Request<any, any, { sizes: Array<number> }>, res: Response, next: NextFunction) {
        try {
            const { sizes } = req.body
            const data = await ProductColorSizesModel.delete(sizes)
            res.json({
                data 
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


export default ProductColorSizesController