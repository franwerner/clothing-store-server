import { DatabaseKeySchema, ShopcartProductSchema } from "clothing-store-shared/schema"
import { Payment, Preference, } from "mercadopago"
import { Items } from "mercadopago/dist/clients/commonTypes"
import mercadoPagoConfig from "../config/mercadopago.config"
import ErrorHandler from "../utils/errorHandler.utilts"

type CheckoutProductToTransform = Omit<ShopcartProductSchema.BaseInShopcart, "size_fk" | "color_fk" | "product_fk">

interface createCheckout {
    items: Array<Items>,
    external_reference: DatabaseKeySchema,
    date_of_expiration: Date,
    shipments: {
        cost: number,
        free_shipping: boolean
    }
}

const preferences = new Preference(mercadoPagoConfig)
const payment = new Payment(mercadoPagoConfig)

class MercadoPagoService {

    static async getPayment(external_reference?: string) {
        try {
            return await payment.search({ options: { external_reference: external_reference as string } })
        } catch (error) {
            return new ErrorHandler({
                message: "Pago no encontrado.",
                status: 404,
                code: "payment_not_found",
            })
        }
    }

    static async getPreference(preference_id: string = "") {
        try {
            return await preferences.get({ preferenceId: preference_id })
        } catch (error) {
            throw new ErrorHandler({
                message: "Preferencia no encontrada",
                status: 404,
                code: "preference_not_found"
            })
        }
    }

    static async createCheckout({
        items,
        external_reference,
        date_of_expiration,
        shipments
    }: createCheckout) {
        try {
            return await preferences.create({
                body: {
                    items,
                    external_reference: external_reference.toString(),
                    expires: true,
                    date_of_expiration: this.toMercadoPagoFormat(date_of_expiration),
                    shipments: {
                        ...shipments,
                        mode: "not_specified"
                    }
                },
            })
        } catch (error) {
            throw new ErrorHandler({
                message: "Error al intentar crear la preferencia de pago.",
                status: 502,
                code: "preference_not_created",
            })
        }
    }

    static async transformProductsToCheckoutItems(products: Array<CheckoutProductToTransform>) {
        return products.reduce((acc, current) => {
            const { id, url, size, color, quantity, price, discount, product } = current
            const items: Items = {
                id,
                quantity,
                title: product,
                unit_price: price * (1 - (discount / 100)),
                description: `Color: ${color} | Talle: ${size}`,
                picture_url: url
            }
            return [
                ...acc,
                items
            ]
        }, [] as Array<Items>)
    }

    private static toMercadoPagoFormat(date: Date) {
        const offset = "-04:00" //UTC -4 de mercadopago.

        date.setUTCHours(date.getUTCHours() - 4)
        const isoString = date.toISOString().replace("Z", "");

        const [datePart, timePart] = isoString.split("T");

        return `${datePart}T${timePart.slice(0, 8)}${offset}`;
    }
}
export default MercadoPagoService

export {
    type CheckoutProductToTransform
}