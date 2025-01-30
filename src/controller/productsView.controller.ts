import { NextFunction, Request } from "express"
import ProductFullViewService from "../service/productFullview.service.js"
import ProductsPreviewService from "../service/productsPreview.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

class ProductsViewController {

    static async getProductsPreview
        (
            req: Request,
            res: APP.ResponseTemplate,
            next: NextFunction
        ) {
        try {
            const { brand, category } = req.params
            const { color, price, search, size, sortDirection, sortField, offset } = req.query as Record<string, any>
            const data = await ProductsPreviewService.getProductPreview({
                filters: {
                    brand,
                    category,
                    color,
                    price,
                    search,
                    size
                },
                order: { sortDirection, sortField },
                pagination: { offset }
            })
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

    static async getProductColorsPreview(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { price, search, size, brand, category } = req.query as Record<string, any>
            const data = await ProductsPreviewService.getProductColors({
                brand,
                category,
                price,
                search,
                size
            })

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
    static async getProductSizesPreview(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { price, search, color, brand, category } = req.query as Record<string, any>
            const data = await ProductsPreviewService.getProductSizes({
                brand,
                category,
                price,
                search,
                color
            })
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

    static async getProductFullView(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { product, brand, category } = req.params
            const data = await ProductFullViewService.main({ brand, category, product })
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
}

export default ProductsViewController