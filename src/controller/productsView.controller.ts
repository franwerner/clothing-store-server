import { NextFunction, Request, Response } from "express"
import ProductColorImagesModel from "../model/productColorImages.model.js"
import ProductColorsModel from "../model/productColors.model.js"
import ProductsModel from "../model/products.model.js"
import ProductColorSizesModel from "../model/productSizes.model.js"
import productsPreviewModel from "../model/productsPreview.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"
import generateProductPreviewFilters from "../utils/generateProductPreviewFilters.js"

class ProductsViewController {

    static async getProductsPreview(req: Request, res: Response, next: NextFunction) {
        try {
            const filterParams = generateProductPreviewFilters(req)
            const data = await productsPreviewModel(filterParams)
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }

        }
    }

    static async getProductFullView(req: Request, res: Response, next: NextFunction) {
        try {

            const { product_id } = req.params

            const [product] = await ProductsModel.selectExistsColors({ product_id, status: true })

            if (!product) throw new ErrorHandler({ message: "No se encontro ningun producto", status: 404 })

            const productColorModel = await ProductColorsModel.selectExistsSizes({ product_fk: product.product_id })

            if (productColorModel.length == 0) throw new ErrorHandler({ message: "No se encontro ningun producto", status: 404 })

            const colors = await Promise.all(
                productColorModel.map(async (i) => {
                    const product_color_id = i.product_color_id
                    const color_images = await ProductColorImagesModel.select({ product_color_fk: product_color_id })
                    const color_sizes = await ProductColorSizesModel.select({ product_color_fk: product_color_id })
                    return {
                        color: i,
                        color_images,
                        color_sizes,
                    }
                })
            )

            res.json({
                data: {
                    product,
                    colors
                },
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            }
            else {
                next()
            }

        }
    }

}

export default ProductsViewController