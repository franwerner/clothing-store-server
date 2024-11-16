import { NextFunction, Request, Response } from "express"
import ProductColorImagesModel, { ProductColorImage } from "../model/productColorImages.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"

type ProductColorSizeBody = {
    images: Array<ProductColorImage>
}

class ProductColorImagesController {
    static async setProductColorImages(req: Request<any, any, ProductColorSizeBody>, res: Response, next: NextFunction) {

        try {
            const { images } = req.body
            const data = await ProductColorImagesModel.insert(images)

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

    static async modifyProductColorImages(req: Request<any, any, ProductColorSizeBody>, res: Response, next: NextFunction){
        try {
            const { images } = req.body

            const data = await Promise.all(
                images.map(i => ProductColorImagesModel.update(i))
            )
            
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

    static async removeProductColorImages(req: Request<any, any, { images: Array<number> }>, res: Response, next: NextFunction) {
        try {
            const { images } = req.body
            const data = await ProductColorImagesModel.delete(images)
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


export default ProductColorImagesController