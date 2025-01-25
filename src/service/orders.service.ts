import { DatabaseKeySchema, UserPurchaseAddressesSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema"
import { storeConfig } from "../constant/storeConfig.contant"
import ServiceUtils from "../utils/service.utils"
import startTransaction from "../utils/startTransaction.utilts"
import MercadoPagoService from "./mercadoPago.service"
import UserPurchaseAddresessService from "./userPurchaseAddresess.service"
import UserPurchaseGuestsService from "./userPurchaseGuests.service"
import UserPurchasesService, { CreateUserPurchase } from "./userPurchases.service"
import UserPurchaseShippingsService from "./userPurchaseShippings.service"
import UserPurchaseProductsService, { CreateUserPurchaseProducts } from "./userPurchaseProducts.service"


type CreateOrder = {
    order: CreateUserPurchase
    order_products: CreateUserPurchaseProducts
}

class OrdersService extends ServiceUtils {

    static async createOrderCheckout({ expired_date, user_purchase_id }: { user_purchase_id: DatabaseKeySchema, expired_date: Date }) {
        const transform = await MercadoPagoService.transformProductsToCheckoutItems(user_purchase_id)
        const total = await UserPurchaseShippingsService.calculateFreeShipping(user_purchase_id)
        const data = await MercadoPagoService.createCheckout({
            items: transform,
            external_reference: user_purchase_id,
            date_of_expiration: expired_date,
            shipments: {
                cost: 15000,
                free_shipping: total >= storeConfig.minFreeShipping
            }
        })
        return data
    }

    static async createOrder({
        order,
        order_products,
        order_address,
        order_guest
    }: CreateOrder & { order_address: UserPurchaseAddressesSchema.Insert; order_guest?: UserPurchaseGuestsSchema.Insert }) {
        let tsx = await startTransaction()
        try {
            const { user_purchase_id } = await UserPurchasesService.create(order, tsx)
            const productsWithID = order_products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }))
            await UserPurchaseProductsService.create(productsWithID, tsx)
            await UserPurchaseAddresessService.create({ ...order_address, user_purchase_fk: user_purchase_id }, tsx)
            if (order_guest) await UserPurchaseGuestsService.create({ ...order_guest, user_purchase_fk: user_purchase_id }, tsx)
            await tsx.commit()
            const { init_point, id, date_of_expiration } = await this.createOrderCheckout({ expired_date: order.expire_at, user_purchase_id })
            await UserPurchasesService.update({
                user_purchase_id,
                preference_id: id,
            })
            return {
                init_point,
                date_of_expiration
            }
        } catch (error) {
            await tsx.rollback()
            throw error
        }
    }

}

export default OrdersService

