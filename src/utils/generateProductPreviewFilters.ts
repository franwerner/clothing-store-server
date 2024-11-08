import { Request } from "express"
import toNumber from "./toNumber.utilts.js"

type ProductPreviewFilters = {
    color?: string[],
    price?: [string, string],
    search?: string,
    size?: string[]
    brand_id?: string,
    category_id?: string
}

const generateProductPreviewFilters = (query: Request) => {

    const { color = "", price = "", search = "", size = "" } = query.query as Record<"color" | "price" | "size" | "search", string>

    const { brand_id, category_id } = query.params as Record<"brand_id" | "category_id", string>

    const filterProperties = {
        color,
        price,
        search,
        size,
        brand_id,
        category_id
    }

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

export {
    type ProductPreviewFilters
}
export default generateProductPreviewFilters;