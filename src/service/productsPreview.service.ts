import { OrderProducts } from "clothing-store-shared/types"
import ProductPreviewModel from "../model/productsPreview.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"

interface ProductPreviewFilters {
    color?: string[],
    search?: string,
    brand?: string,
    category?: string
    size?: string[]
    price?: [string, string] | [string],
}

interface ProductPreviewOrder {
    sortDirection: "asc" | "desc",
    sortField: OrderProducts
}

interface ProductPreviewPagination {
    offset: string
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

    static async getProductPreview({
        filters,
        order,
        pagination
    }: {
        filters: ProductPreviewFilters
        order: ProductPreviewOrder
        pagination: ProductPreviewPagination
    }) {
        const res = await ProductPreviewModel.select({
            filters,
            order,
            pagination
        })
        if (res.length == 0) {
            throw new ErrorHandler({
                message: "No se encontro ningun producto",
                status: 404,
                code: "product_not_found"
            })
        }
        return res
    }

    static async getProductColors(filter: Omit<ProductPreviewFilters, "color">) {
        const res = await ProductPreviewModel.selectProductColors(filter)
        if (res.length === 0) throw new ErrorHandler({
            code: "product_colors_not_found",
            status: 404,
            message: "No se encontraron colores asociados a los productos."
        })
        return res
    }

    static async getProductSizes(filter: Omit<ProductPreviewFilters, "size">) {
        const res = await ProductPreviewModel.selectProductSizes(filter)
        if (res.length === 0) throw new ErrorHandler({
            code: "product_color_sizes_not_found",
            message: "No se encontraron tamaños asociados a los productos.",
            status: 404
        })
        return res
    }

}

export type { ProductPreviewFilters, ProductPreviewOrder, ProductPreviewPagination }
export default ProductsPreviewService