import { NextFunction, Request, Response } from "express";
import ProductsRecomendationsService from "../service/productsRecomendations.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class ProductsRecomendationsController {

    static async getRandomProductRecomendation(
        _: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const products = await ProductsRecomendationsService.getRandomProductRecomendation()
            res.json({
                data: {
                    products
                }
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



export default ProductsRecomendationsController