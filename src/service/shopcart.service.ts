import { Shopcart } from "clothing-store-shared/types";
import ErrorHandler from "../utils/errorHandler.utilts";
import ShopcartModel from "../model/views/shopcart.model";
import { createUTCDate, isNumber, parseDate } from "my-utilities";
import zodParse from "../helper/zodParse.helper";
import { shopcartProductSchema, ShopcartProductSchema } from "clothing-store-shared/schema";
import store from "@/config/store.config";
import ProductColorImagesService from "./products/productColorImages.service";

class ShopcartService {

    static calculateTotal(products: ShopcartProductSchema.BaseInShopcart[]) {
        const parse = zodParse(shopcartProductSchema.baseInShopcartProduct.array())(products)
        return parse.reduce((acc, { discount, price, quantity }) => {
            const calc = (price) * (1 - (discount / 100)) * quantity
            return acc + calc
        }, 0)
    }
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
        const { product_color_id, ...restDetails } = details
        const url = await ProductColorImagesService.selectOneImageByProductColor(product_color_id) || ""

        return zodParse(shopcartProductSchema.baseInShopcartProduct)({
            ...product,
            ...restDetails,
            url
        })
    }

    static async addProducts(products: Array<ShopcartProductSchema.BaseInShopcart>, newProducts: Array<ShopcartProductSchema.BaseOutShopcart>) {
        const cloneProducts = structuredClone(products)
        const parseNewProducts = zodParse(shopcartProductSchema.baseOutShopcartProduct.array())(newProducts)

        for (const product of parseNewProducts) {
            const { color_fk, product_fk, quantity, size_fk, } = product
            const repeated = cloneProducts.find(i => i.color_fk == color_fk && i.product_fk == product_fk && i.size_fk == size_fk)
            if (repeated) {
                repeated.quantity += quantity
            } else {
                const details = await this.getDetailProduct(product)
                cloneProducts.push(details)
            }
        }
        return cloneProducts
    }

    static async createShopcart(shopcart?: Shopcart) {
        if (!shopcart || parseDate(shopcart.expire_at) < new Date() || shopcart.products.length === 0) {
            const { min_free_shipping = 0, cost_based_shipping = 0 } = store.ensure("config")
            const newShopcart: Shopcart = {
                products: [],
                expire_at: createUTCDate({ hours : 1 }),
                shipping: {
                    cost_based_shipping,
                    min_free_shipping
                }
            }
            return newShopcart
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

}

export default ShopcartService
