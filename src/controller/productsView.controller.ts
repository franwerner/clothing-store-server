import { NextFunction, Request } from "express"
import ProductFullViewService from "../service/productFullview.service.js"
import ProductsPreviewService from "../service/productsPreview.service.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import { OrderProducts } from "clothing-store-shared/types"

type Params = {
    brand: string,
    category: string
}
type Query = {
    color: string
    price: string,
    search: string,
    size: string,
    order: "asc" | "desc"
    orderKey: OrderProducts
    limit: string
    offset: string

}
class ProductsViewController {

    static async getProductsPreview
        (req: Request<Params, any, any, Query>,
            res: APP.ResponseTemplate,
            next: NextFunction
        ) {
        try {
            const { brand, category } = req.params
            const { color, price, search, size, order, orderKey } = req.query

            const data = await ProductsPreviewService.main({
                brand,
                category,
                color,
                price,
                search,
                size,
            }, {
                orderKey,
                order
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
            const { product_id } = req.params
            const data = await ProductFullViewService.main(product_id)
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