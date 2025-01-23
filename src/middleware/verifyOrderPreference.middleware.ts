import { NextFunction, Request } from "express";
import getSessionData from "../helper/getSessionData.helper";
import MercadoPagoService from "../service/mercadoPago.service";
import UserPurchasesService from "../service/userPurchases.service";
import ErrorHandler from "../utils/errorHandler.utilts";
import errorGlobal from "./errorGlobal.middleware";

/**
 * Esta funcion nos ayudara a verificar si se puede crear una nueva preferencia de pago.
 * Uso actualmente en la ruta mercadopago/checkout
 */

const verifyOrderPreference = async (
    req: Request,
    res: APP.ResponseTemplate<any, { expired_date: Date }>,
    next: NextFunction
) => {

    try {
        const { user_purchase_id } = req.params
        const user = getSessionData("user_info", req.session)
        const { preference_id, expire_at = "" } = await UserPurchasesService.getForUser({ user_fk: user.user_id, user_purchase_id })

        const current_date = new Date()
        const expired_date = new Date(expire_at)

        if (current_date > expired_date) throw new ErrorHandler({
            message: "No puedes obtener la preferencia de pago debido a que venció el plazo de la orden de compra.",
            status: 403,
            code: "expired_order"
        })

        try {
            const preference = await MercadoPagoService.getPreference(preference_id?.toString())
            /**
             * A veces puede tardar en impactar la preferencia de pago creada con mercadopago.
             * Es decir al intentar obtenerlo luego de unos segundos/minutos de crearla, puede que falle al encontrarla.
             * Entonces si no se encuentra que se le permita al usuario crear otra para obtener una mas reciente lo mas rapido posible.
             * Otra posibilidad es que no se haya actualizado nuestra base de datos con el preference_id correctamente,
             * debido a un error en el proceso final de creacion del checkout y este campo este null
             */
            const { init_point, date_of_expiration } = preference
            res.json({
                data: {
                    init_point,
                    date_of_expiration,
                }
            })
        } catch (error) {
            res.locals = {
                expired_date
            }
            next()//Permite al routa donde se utiliza este middleware poder crear otra preferencia complementametne nueva.
        }

    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }


}


export default verifyOrderPreference