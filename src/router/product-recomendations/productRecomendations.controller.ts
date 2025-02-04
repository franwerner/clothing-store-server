import { NextFunction, Request } from "express";
import ProductsRecomendationsService from "@/service/products/productsRecomendations.service.js";
import ErrorHandler from "@/utils/errorHandler.utilts.js";

class ProductRecomendationsController {

    static async getRandomProductRecomendation(
        _: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {

            const products = await ProductsRecomendationsService.getRandomProductRecomendation()
            res.json({
                data: {
                    products
                },
                
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



export default ProductRecomendationsController