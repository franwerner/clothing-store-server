import { NextFunction, Request, Response } from "express"
import { Knex } from "knex"
import sql from "../database/index.js"
import ProductColorImagesModel, { ProductColorImage } from "../model/productColorImages.model.js"
import ProductColorsModel, { ProductColor } from "../model/productColors.model.js"
import ProductsModel, { Product } from "../model/products.model.js"
import ProductColorSizesModel, { ProductColorSize } from "../model/productSizes.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"


/**
 * @IMPORTANTE : 
 * No se debe modificar la referencia del tamaño (size) al color (color) 
 * o del color al producto (product), ya que esto podría afectar 
 * la visualización de las compras de los usuarios.
 *
 * @Razones :
 * 1. **Integridad del historial de compras**: 
 *    Si un usuario compra un producto con un tamaño específico,
 *    se almacena en la base de datos la ID del producto, tamaño y color.
 * 2. **Consistencia de datos**:
 *    Cambiar alguna referencia podría llevar a inconsistencias en
 *    el historial de compras, donde los tamaños o colores no coincidan
 *    con lo que realmente el usuario compró.
 * 
 * @Ejemplo :
 * Si cambiamos la referencia de un tamaño a otro producto, 
 * se generaría confusión en el historial de compras, ya que 
 * el usuario vería información incorrecta relacionada con sus compras.
 */

type ProductBody = {
    product: Product,
    colors: Array<{
        color: ProductColor,
        color_images: Array<ProductColorImage>,
        color_sizes: Array<ProductColorSize>
    }>,
}

class ProductsManagerController {

    static async setProduct(req: Request<any, any, ProductBody>, res: Response, next: NextFunction) {
        let transsaction = {} as Knex.Transaction
        try {
            transsaction = await sql.transaction()
            const { colors, product } = req.body
            const [product_fk] = await ProductsModel.insertProduct(product, transsaction)

            if (!Array.isArray(colors) || colors.length == 0) throw new ErrorHandler({ message: "No se proporcionaron colores para los productos. Por favor, asegúrate de incluir al menos un color.", status: 400 })

            for (const e of colors) {
                const { color, color_images, color_sizes } = e
                const [product_color_fk] = await ProductColorsModel.insertColor({ ...color, product_fk }, transsaction)

                if (!Array.isArray(color_sizes) || color_sizes.length == 0) throw new ErrorHandler({ message: `El color ${color.color} no tiene tamaños asignados. Por favor, agrega al menos un tamaño.`, status: 400 })
                await Promise.all(color_images.map((i) => ProductColorImagesModel.insertColorImage({ ...i, product_color_fk }, transsaction)))
                await Promise.all(color_sizes.map((i) => ProductColorSizesModel.insertColorSize({ ...i, product_color_fk }, transsaction)))
            }
            await transsaction.commit()
            res.status(200).json({
                status: 200
            })
        } catch (error) {
            transsaction?.rollback && await transsaction.rollback()
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async modifyProduct(req: Request<any, any, ProductBody>, res: Response, next: NextFunction) {

        let transsaction = {} as Knex.Transaction

        try {
            const { colors = [], product } = req.body
            transsaction = await sql.transaction()
            product && await ProductsModel.updateProduct(product, transsaction)
            for (const e of colors) {
                const { color, color_images = [], color_sizes = [] } = e
                color && await ProductColorsModel.updateColor(color, transsaction)
                color_images && await Promise.all(color_images.map((i) => ProductColorImagesModel.updateColorImage(i, transsaction)))
                color_sizes && await Promise.all(color_sizes.map((i) => ProductColorSizesModel.updateColorSize(i, transsaction)))
            }
            res.json({
                status: 200
            })
            transsaction.commit()
        } catch (error) {
            transsaction?.rollback && await transsaction.rollback()
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { product_id } = req.params
            const product = await ProductsModel.selectProduct({ product_id, permission: "admin" })
            res.json({
                status: 200,
                data: {
                    product: product
                }
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { product_category } = req.query
            const product = await ProductsModel.selectProduct({ permission: "admin", product_category_fk: product_category as string })
            res.json({
                status: 200,
                data: {
                    product: product
                }
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

}

export default ProductsManagerController