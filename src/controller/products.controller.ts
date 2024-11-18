import { NextFunction, Request } from "express"
import { ProductSchema } from "../schema/product.schema.js"
import ProductsService from "../service/products.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

class ProductsController {

    static async getProductsPerCategory(
        _: Request, 
        res: APP.ResponseTemplate<ProductSchema.Base[]>,
        next: NextFunction
    ) {
        try {
            const data = await ProductsService.get()
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

    static async addProducts(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductSchema.Insert>,
        next: NextFunction
    ) {
        try {
            const data = await ProductsService.insert(req.body)
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

    static async modifyProducts(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductSchema.Update>,
        next: NextFunction
    ) {
        try {
            const data = await ProductsService.update(req.body)

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

    static async removeProducts(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ProductSchema.Delete>,
        next: NextFunction
    ) {
        try {
            const data = await ProductsService.delete(req.body)
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

export default ProductsController