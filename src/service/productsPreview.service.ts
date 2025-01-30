import { SortProducts } from "clothing-store-shared/types"
import ProductPreviewModel from "../model/productsPreview.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import { toNumber } from "my-utilities"

interface FilterProperties {
    color?: string[],
    search?: string,
    brand?: string,
    category?: string
    size?: string[]
    price?: [string, string] | [string],
}

interface SortProperties {
    sortDirection: "asc" | "desc",
    sortField: SortProducts
}

interface PaginationProperties {
    offset: number
}

type InputFilterProperties = { [K in keyof FilterProperties]?: string }
class ProductsPreviewService {
    private static generateFilter(filterProperties: InputFilterProperties) {
        let res = {} as FilterProperties
        for (const key in filterProperties) {
            const k = key as keyof FilterProperties
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

    private static generateSort({ sortDirection, sortField }: SortProperties) {
        return {
            sortDirection: ["asc", "desc"].includes(sortDirection) ? sortDirection : "asc",
            sortField
        }
    }

    private static generatePagiantion({ offset }: PaginationProperties) {
        return {
            offset: toNumber(offset)
        }
    }

    static async getProductPreview({
        filters,
        order,
        pagination
    }: {
        filters: InputFilterProperties
        order: SortProperties
        pagination: PaginationProperties
    }) {
        const res = await ProductPreviewModel.select({
            filters: this.generateFilter(filters),
            order: this.generateSort(order),
            pagination: this.generatePagiantion(pagination)
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

    static async getProductColors(filter: Omit<InputFilterProperties, "color">) {
        const res = await ProductPreviewModel.selectProductColors(this.generateFilter(filter))
        if (res.length === 0) throw new ErrorHandler({
            code: "product_colors_not_found",
            status: 404,
            message: "No se encontraron colores asociados a los productos."
        })
        return res
    }

    static async getProductSizes(filter: Omit<InputFilterProperties, "size">) {
        const res = await ProductPreviewModel.selectProductSizes(this.generateFilter(filter))
        if (res.length === 0) throw new ErrorHandler({
            code: "product_color_sizes_not_found",
            message: "No se encontraron tamaños asociados a los productos.",
            status: 404
        })
        return res
    }

}

export type { FilterProperties, PaginationProperties, SortProperties }
export default ProductsPreviewService