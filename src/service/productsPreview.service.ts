import { DatabaseKeySchema } from "clothing-store-shared/schema"
import { OrderProducts } from "clothing-store-shared/types"
import ProductPreviewModel from "../model/productsPreview.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import { number } from "zod"

interface ProductPreviewFilters {
    color?: string[],
    search?: string,
    brand?: string,
    category?: string
    size?: string[]
    price?: [string, string] | [string],
}

interface ProductPreviewOrder {
    order: "asc" | "desc",
    orderKey: OrderProducts
}

type FilterProperties = { [K in keyof ProductPreviewFilters]?: string }
class ProductsPreviewService {

    static generateProductPreviewFilters(filterProperties: FilterProperties) {

        let res = {} as ProductPreviewFilters

        for (const key in filterProperties) {
            const k = key as keyof ProductPreviewFilters
            const current = filterProperties[k]
            if (current) {
                if (k === "price") {
                    const [min, max] = current.split("-")
                    if (min !== "0" || max !== "0") {
                        if (Number(min) > Number(max)) {
                            res[k] = [min]
                        } else {
                            res[k] = [min, max]
                        }
                    }
                } else if (k == "color" || k == "size") {
                    const split = current.split("-").filter(Boolean)
                    res[k] = split
                } else {
                    res[k] = current
                }
            }
        }

        return res
    }

    static async getProductPreview(filterParams: ProductPreviewFilters, order: ProductPreviewOrder) {
        const res = await ProductPreviewModel.getProducts(filterParams, order)
        if (res.length == 0) {
            throw new ErrorHandler({
                message: "No se encontro ningun producto",
                status: 404,
                code: "product_not_found"
            })
        }
        return res
    }

    static async getProductColors(productsIDs: Array<DatabaseKeySchema>, sizeIDs?: Array<DatabaseKeySchema>) {
        const res = await ProductPreviewModel.getProductColors(productsIDs, sizeIDs)
        if (res.length === 0) throw new ErrorHandler({
            code: "product_colors_not_found",
            status: 404,
            message: "No se encontraron colores asociados a los productos."
        })
        return res
    }

    static async getProductSizes(productsIDs: Array<DatabaseKeySchema>, colorIDs?: Array<DatabaseKeySchema>) {
        const res = await ProductPreviewModel.getProductSizes(productsIDs, colorIDs)
        if (res.length === 0) throw new ErrorHandler({
            code: "product_color_sizes_not_found",
            message: "No se encontraron tamaños asociados a los productos.",
            status: 404
        })
        return res
    }

    static async main(filterProperties: FilterProperties, order: ProductPreviewOrder) {
        const filterParams = this.generateProductPreviewFilters(filterProperties)
        const products = await this.getProductPreview(filterParams, order)
        /**
         * Se tienen que filtrar primero en base a toda la logica del producto en si para obtener los color y tamaños,
         * Esto nos ayuda a ahorra logica con respecto a la obtencion de los colores y tamaños, ya que unicamente les estariamos pasandos las IDs obtenidas.
         */
        const productIDs = [...new Set(products.map(({ product_id }) => product_id))]
        return {
            products,
            colors: await this.getProductColors(productIDs, filterParams.size),
            sizes: await this.getProductSizes(productIDs, filterParams.color)
        }
    }
}

export type { ProductPreviewFilters, ProductPreviewOrder }
export default ProductsPreviewService