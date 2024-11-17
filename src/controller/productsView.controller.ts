import { NextFunction, Request, Response } from "express"
import ProductFullViewService from "../service/productFullview.service.js"
import ProductsPreviewService from "../service/productsPreview.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

type Params = {
    brand_id: string,
    category_id: string
}
type Query = {
    color: string
    price: string,
    search: string,
    size: string
}
class ProductsViewController {

    static async getProductsPreview
    (req: Request<Params, any, any, Query>, 
        res: Response, 
        next: NextFunction
    ) {
        try {
            const { brand_id, category_id } = req.params
            const { color, price, search, size } = req.query

            const data = await ProductsPreviewService.main({
                brand_id,
                category_id,
                color,
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

    static async getProductFullView(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const { product_id } = req.params

            const data = await ProductFullViewService.main(product_id)

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

export default ProductsViewController