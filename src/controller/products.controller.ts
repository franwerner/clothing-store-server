import { NextFunction, Request, Response } from "express"
import ProductsModel, { Product } from "../model/products.model.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

type ProductBody = {
    products: Array<Product>,
}

class ProductsController {

    static async setProducts(req: Request<any, any, ProductBody>, res: Response, next: NextFunction) {
        try {
            const { products } = req.body

            const data = await ProductsModel.insert(products)

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

    static async removeProducts(req: Request<any, any, { products: Array<number> }>, res: Response, next: NextFunction) {

        try {
            const products = req.body.products
            const data = await ProductsModel.delete(products)
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

    static async modifyProducts(req: Request<any, any, ProductBody>, res: Response, next: NextFunction) {
        try {
            const { products } = req.body
            const data = await Promise.all(products.map(i => ProductsModel.update(i)))
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

    static async getProductsPerCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { category_id } = req.params
            const data = await ProductsModel.select({ category_fk: category_id})
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

export default ProductsController