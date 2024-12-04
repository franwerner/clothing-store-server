import { Payment, Preference, } from "mercadopago"
import { Items, Shipments } from "mercadopago/dist/clients/commonTypes"
import sql from "../config/knex.config"
import mercadoPagoConfig from "../config/mercadopago.config"
import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import { DatabaseKeySchema } from "../schema/databaseKey.schema"
import ErrorHandler from "../utils/errorHandler.utilts"

interface createCheckout {
    items: Array<Items>,
    external_reference: DatabaseKeySchema,
    date_of_expiration: Date,
    shipments : {
        cost : number,
        free_shipping : boolean
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
                message : "Pago no encontrado.",
                status : 404,
                code : "payment_not_found"
             })
        }
    }

    static async getPreference(preference_id?: string) {
        try {
            return await preferences.get({ preferenceId: preference_id as string })
        } catch (error) {
            return  new ErrorHandler({
                message: "Preferencia no encontrada",
                status: 404,
                code : "preference_not_found"
            })
        }
    }

    static async createCheckout({
        items,
        external_reference,
        date_of_expiration,
        shipments
    }: createCheckout) {
        /**
         * Tiempo de expiracion 3 horas.
         * Solo se generara cuando se cree la orden de compra y debe ser unico por cada external_reference.
         */

        return await preferences.create({
            body: {
                items,
                external_reference: external_reference.toString(),
                expires: true,
                date_of_expiration: this.toMercadoPagoFormat(date_of_expiration),
                shipments : {
                    ...shipments,
                    mode : "not_specified"
                }
            },
        })
    }

    static async transformProductsToCheckoutItems(props: { user_fk: DatabaseKeySchema, user_purchase_fk: DatabaseKeySchema, }) {
        const data = await UserPurchaseProductsModel.selectDetailedForUser(props,
            (build) => build.select(sql.raw(
                `
                user_purchase_product_id as id,
                product as title,
                quantity,
                upp.price * (1 - (upp.discount / 100)) as unit_price,
                CONCAT('Color:',' ',color,' | ','Talle:',' ',size) as description,
                'ARS' as currency_id
                `
            ))
        )
        if (data.length == 0) throw new ErrorHandler({
            status: 404,
            message: "No se pueden generar productos para la preferencia, ya que no se encontraron productos asociados a la orden.",
            code : "products_not_found"
        })
        return data as unknown as Array<Items>
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
