import productsPreviewModel from "../model/productsPreview.model.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import toNumber from "../utils/toNumber.utilts.js"

type ProductPreviewFilters = {
    color?: string[],
    search?: string,
    brand_id?: string,
    category_id?: string
    size?: string[]
    price?: [string, string],
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
                    const [_min, _max] = current.split("-")
                    const min = toNumber(_min)
                    const toNumberMax = toNumber(_max)
                    const max = !toNumberMax ? 10000000000 : toNumberMax//En caso de que no este definido deseamos que se muestre "el maximo infinito".
                    const op = (prop: "max" | "min") => Math[prop](min, max).toString()
                    res[k] = [
                        op("min"),
                        op("max")
                    ]
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

    static async getProductPreview(filterParams: ProductPreviewFilters) {

        const res = await productsPreviewModel(filterParams)

        if (res.length == 0) {
            throw new ErrorHandler({
                message: "No se encontro ningun producto",
                status: 404,
                code : "product_not_found"
            })
        }
        return res
    }

    static async main(filterProperties: FilterProperties) {
        const filterParams = this.generateProductPreviewFilters(filterProperties)
        return await this.getProductPreview(filterParams)
    }
}

export type {ProductPreviewFilters}
export default ProductsPreviewService