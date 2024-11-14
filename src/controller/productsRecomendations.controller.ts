import { NextFunction, Request, Response } from "express";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import ProductsRecomendationsService from "../service/productsRecomendations.service.js";

class ProductsRecomendationsController {

    static async getRandomProductRecomendation(req: Request, res: Response, next: NextFunction) {
        try {
            
            const products = await ProductsRecomendationsService.getRandomProductRecomendation()
                
            res.json({
                data : {
                    products
                }
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }
}



export default ProductsRecomendationsController