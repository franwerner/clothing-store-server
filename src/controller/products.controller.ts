import { NextFunction, Request } from "express"
import { ProductSchema } from "../schema/product.schema.js"
import ProductsService from "../service/products.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

class ProductsController {

    static async getByCategory(
        req: Request<{category_id:string}>,
        res: APP.ResponseTemplate<ProductSchema.Base[]>,
        next: NextFunction
    ) {
        try {
            const {category_id = ""} = req.params
            const data = await ProductsService.getByCategory(category_id)
            res.json({
                data,
                
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

    static async updateByCategory(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

             await ProductsService.updateByCategory(req.body)

            res.json({
                message :"Productos modificados correctamente.",
                
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
             await ProductsService.insert(req.body)
            res.json({
                message : "Productos agregados correctamente.",
                
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
           await ProductsService.update(req.body)

            res.json({
                message : "Productos modificados correctamente.",
                
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await ProductsService.delete(req.body)
            res.json({
                message : "Productos eliminados correctamente.",
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