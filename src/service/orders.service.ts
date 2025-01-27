import { DatabaseKeySchema, ShopcartProductSchema, UserPurchaseAddressesSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema"
import ServiceUtils from "../utils/service.utils"
import MercadoPagoService from "./mercadoPago.service"
import UserPurchaseAddresessService from "./userPurchaseAddresess.service"
import UserPurchaseGuestsService from "./userPurchaseGuests.service"
import UserPurchasesService, { CreateUserPurchase } from "./userPurchases.service"
import UserPurchaseShippingsService from "./userPurchaseShippings.service"
import UserPurchaseProductsService, { CreateUserPurchaseProducts } from "./userPurchaseProducts.service"
import sql from "../config/knex.config"
import { Shopcart } from "clothing-store-shared/types"
import ShopcartService from "./shopcart.service"

interface CreateOrder {
    order: CreateUserPurchase
    order_products: ShopcartProductSchema.BaseInShopcart[]
    order_address: UserPurchaseAddressesSchema.Insert
    order_guest?: UserPurchaseGuestsSchema.Insert
    order_shipping: Shopcart["shipping"]
}
interface CreateOrderCheckout {
    user_purchase_id: DatabaseKeySchema
    expired_date: Date
    uuid: string
    shipping_cost: number
    free_shipping: boolean
}
class OrdersService extends ServiceUtils {

    private static async createOrderCheckout({
        expired_date,
        user_purchase_id,
        uuid,
        shipping_cost,
        free_shipping
    }: CreateOrderCheckout) {
        const transform = await MercadoPagoService.transformProductsToCheckoutItems(user_purchase_id)
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
        const res = await sql.transaction(async (trx) => {
            const { user_purchase_id, uuid } = await UserPurchasesService.create(order, trx)
            const productsWithID = order_products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }))
            await UserPurchaseProductsService.create(productsWithID, trx)
            await UserPurchaseAddresessService.create({ ...order_address, user_purchase_fk: user_purchase_id }, trx)
            const total = ShopcartService.calculateTotal(order_products)
            const free_shipping = total > min_free_shipping
            await UserPurchaseShippingsService.create({
                free_shipping,
                cost: cost_based_shipping,
                user_purchase_fk: user_purchase_id
            }, trx)
            if (order_guest) {
                await UserPurchaseGuestsService.create({ ...order_guest, user_purchase_fk: user_purchase_id }, trx)
            }
            return {
                user_purchase_id,
                free_shipping,
                uuid
            }
        })
        const { free_shipping, user_purchase_id, uuid } = res
        const { init_point, id, date_of_expiration } = await this.createOrderCheckout({
            user_purchase_id,
            uuid,
            expired_date: order.expire_at,
            free_shipping: free_shipping,
            shipping_cost: cost_based_shipping
        })
        await UserPurchasesService.update({
            user_purchase_id,
            preference_id: id,
        })
        return {
            init_point,
            date_of_expiration
        }
    }

}

export default OrdersService

