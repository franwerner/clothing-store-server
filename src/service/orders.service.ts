import { ShopcartProductSchema, UserPurchaseAddressesSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema"
import { Shopcart } from "clothing-store-shared/types"
import sql from "../config/knex.config"
import ServiceUtils from "../utils/service.utils"
import ShopcartService from "./shopcart.service"
import UserPurchaseAddresessService from "./users/purchase/userPurchaseAddresess.service"
import UserPurchaseGuestsService from "./users/purchase/userPurchaseGuests.service"
import UserPurchaseProductsService from "./users/purchase/userPurchaseProducts.service"
import UserPurchasesService, { CreateUserPurchase } from "./users/purchase/userPurchases.service"
import UserPurchaseShippingsService from "./users/purchase/userPurchaseShippings.service"
import MercadoPagoService, { CheckoutProductToTransform } from "./mercadoPago.service"
interface CreateOrder {
    order: CreateUserPurchase
    order_products: Array<ShopcartProductSchema.BaseInShopcart>
    order_address: UserPurchaseAddressesSchema.Insert
    order_guest?: UserPurchaseGuestsSchema.Insert
    order_shipping: Shopcart["shipping"]
}
interface CreateOrderCheckout {
    order_products: Array<CheckoutProductToTransform>
    expired_date: Date
    uuid: string
    shipping_cost: number
    free_shipping: boolean
}
class OrdersService extends ServiceUtils {

    private static async createOrderCheckout({
        expired_date,
        order_products,
        uuid,
        shipping_cost,
        free_shipping
    }: CreateOrderCheckout) {
        const transform = await MercadoPagoService.transformProductsToCheckoutItems(order_products)
        const data = await MercadoPagoService.createCheckout({
            items: transform,
            external_reference: uuid,
            date_of_expiration: expired_date,
            shipments: {
                cost: shipping_cost,
                free_shipping: free_shipping
            }
        })
        return data
    }

    static async createOrder({
        order,
        order_products,
        order_address,
        order_guest,
        order_shipping
    }: CreateOrder) {
        const { cost_based_shipping, min_free_shipping } = order_shipping
        return await sql.transaction(async (trx) => {
            const { user_purchase_id, uuid } = await UserPurchasesService.create(order, trx)
            const productsWithID = order_products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }))
            await UserPurchaseProductsService.create(productsWithID, trx)
            await UserPurchaseAddresessService.create({ ...order_address, user_purchase_fk: user_purchase_id }, trx)
            const total = ShopcartService.calculateTotal(order_products)
            const free_shipping = total > min_free_shipping
            await UserPurchaseShippingsService.create({
                free_shipping,
                cost: cost_based_shipping,
                user_purchase_fk: user_purchase_id,
            }, trx)
            if (order_guest) {
                await UserPurchaseGuestsService.create({ ...order_guest, user_purchase_fk: user_purchase_id }, trx)
            }
            const { init_point, id, date_of_expiration } = await this.createOrderCheckout({
                order_products,
                uuid,
                expired_date: order.expire_at,
                free_shipping: free_shipping,
                shipping_cost: cost_based_shipping
            })
            await UserPurchasesService.update({
                user_purchase_id,
                preference_id: id,
            }, trx)
            return {
                init_point: init_point,
                date_of_expiration: date_of_expiration,
            }
        })
    }

}

export default OrdersService

