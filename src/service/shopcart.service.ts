import { Shopcart } from "clothing-store-shared/types";
import ErrorHandler from "../utils/errorHandler.utilts";
import ShopcartModel from "../model/shopcart.model";
import { isNumber } from "my-utilities";
import zodParse from "../helper/zodParse.helper";
import { shopcartProductSchema, ShopcartProductSchema } from "clothing-store-shared/schema";

class ShopcartService {

    static async getDetailProduct(product: ShopcartProductSchema.BaseOutShopcart) {
        const parseProduct = zodParse(shopcartProductSchema.baseOutShopcartProduct)(product)
        const [details] = await ShopcartModel.selectDetailsProducts(parseProduct)
        if (!details) {
            throw new ErrorHandler({
                status: 404,
                message: "El producto no se encuentra disponible o no contiene stock.",
                code: "product_not_available",
                data: product
            })
        }
        return zodParse(shopcartProductSchema.baseInShopcartProduct)({
            ...product,
            ...details,
            url: "", //Cambiar esto es solo para prubeas, la url siempre contendra un string.
            id: crypto.randomUUID()
        })
    }

    static async addProducts(products: Array<ShopcartProductSchema.BaseInShopcart>, newProducts: Array<ShopcartProductSchema.BaseOutShopcart>) {
        const cloneProducts = structuredClone(products)
        const isArrayNewProducts = Array.isArray(newProducts) ? newProducts : []

        const recentProductsChanges = []

        for (const product of isArrayNewProducts) {
            const { color_fk, product_fk, quantity, size_fk, } = product
            const repeated = cloneProducts.find(i => i.color_fk == color_fk && i.product_fk == product_fk && i.size_fk == size_fk)
            if (repeated) {
                repeated.quantity += quantity
                recentProductsChanges.push(repeated)
            } else {
                const details = await this.getDetailProduct(product)
                cloneProducts.push(details)
                recentProductsChanges.push(details)

            }
        }
        return {
            products: cloneProducts,
            recentProductsChanges
        }
    }

    static createShopcart(shopcart?: Shopcart) {
        if (!shopcart || (shopcart.expired_at || 0) < Date.now()) {
            return {
                products: [],
                expired_at: Date.now() + (1000 * 60 * 60 * 3) //3 hours,
            }
        } else {
            return shopcart
        }
    }

    static async updateQuantity(products: Array<ShopcartProductSchema.BaseInShopcart>, product: { id: string, quantity: number }) {
        if (product.quantity <= 0 || !isNumber(product.quantity)) throw new ErrorHandler({
            code: "invalid_product_quantity",
            status: 400,
            message: "La cantidad ingresada debe ser mayor o igual a 1"
        })
        return products.map((i) => {
            if (i.id === product.id) {
                return {
                    ...i,
                    quantity: product.quantity
                }
            }
            return i
        })
    }

    static removeProduct(shopcart: Array<ShopcartProductSchema.BaseInShopcart>, id: string) {
        return shopcart.filter(i => i.id !== id)
    }

    static groupProducts(products: Array<ShopcartProductSchema.BaseInShopcart>) {
        const groupedProducts: Array<ShopcartProductSchema.BaseInShopcart> = []

        for (const product of products) {
            const { color_fk, product_fk, size_fk } = product
            const isEqual = groupedProducts.find(i => (i.color_fk == color_fk && product_fk == i.product_fk && i.size_fk == size_fk))
            if (!isEqual) {
                groupedProducts.push({ ...product })
            } else {
                isEqual.quantity += product.quantity
            }

        }
        return groupedProducts
    }
}

export default ShopcartService
