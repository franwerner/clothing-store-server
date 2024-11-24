import { Payment, Preference, } from "mercadopago"
import { Items } from "mercadopago/dist/clients/commonTypes"
import sql from "../config/knex.config"
import mercadoPagoConfig from "../config/mercadopago.config"
import _env from "../constant/_env.constant"
import UserPurchaseProductsModel from "../model/userPurchaseProducts.model"
import userPurchasesService from "./userPurchases.service"
import ErrorHandler from "../utils/errorHandler.utilts"
import DatabaseErrorHandler from "../utils/databaseErrorHandler.utilts"

interface CreatePreferenceOrder {
    items: Array<Items>,
    user_purchase_id: number
}

const preferences = new Preference(mercadoPagoConfig)
const payment = new Payment(mercadoPagoConfig)
const url = (i: string) => {
    return new URL(i, _env.BACKEND_DOMAIN).href
}

class MercadoPagoService {

    static async paymentHandler({ action, data }: { action: string, data: { id: number } }) {
        if (action !== "payment.created") return
        const res = await payment.get({ id: data.id })
        try {
            await userPurchasesService.updateOperationID({
                operation_id: data.id,
                user_purchase_id: res.external_reference as string
            })
        } catch (error) {
            /**
   * Esto asegura que solo se responda con un error en caso de problemas en la base de datos o errores desconocidos.
   * La notificación de MercadoPago espera recibir una respuesta con un código de estado 200 o 201,
   * de lo contrario, intentará volver a ejecutar la API enviando múltiples notificaciones.
   */
            if (DatabaseErrorHandler.isInstanceOf(error) || !ErrorHandler.isInstanceOf(error)) {
                throw error
            }
        }
    }

    static async createPreferenceOrder({
        items,
        user_purchase_id
    }: CreatePreferenceOrder) {
        return await preferences.create({
            body: {
                items: items,
                notification_url: url("mercadopago/notification"),
                external_reference: user_purchase_id.toString(),
            },
        })
    }

    static async transformProductsToCheckoutItems(user_purchase_fk: number) {
        const data = await UserPurchaseProductsModel.selectAndJoined({ user_purchase_fk },
            (build) => build.select(sql.raw(
                `
                user_purchase_product_id as id,
                product as title,
                quantity,
                price as unit_price,
                CONCAT('Color:',' ',color,' | ','Talle:',' ',size) as description,
                'ARS' as currency_id
                `

            ))
        )
        return data as unknown as Array<Items>
    }
}


export default MercadoPagoService