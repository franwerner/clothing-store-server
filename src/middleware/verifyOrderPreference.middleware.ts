import { NextFunction, Request } from "express";
import UserPurchasesModel from "../model/userPurchases.model";
import MercadoPagoService from "../service/mercadoPago.service";
import ErrorHandler from "../utils/errorHandler.utilts";

const verifyOrderPreference = async (
    req: Request<any, any, any, { user_purchase_id: string }>,
    res: APP.ResponseTemplate<any, { expired_date: Date }>,
    next: NextFunction
) => {

    const { user_purchase_id = "" } = req.query
    const [{ preference_id, expire_at = "", user_purchase_id: id } = {}] = await UserPurchasesModel.select({ user_purchase_id }, (builder) => builder.select("preference_id", "expire_at", "user_purchase_id"))

    const current_date = new Date()
    const expired_date = new Date(expire_at)

    if (!id) {
        res.status(404).json({
            message: `No se encontro ninguna orden de compra con la ID:${user_purchase_id}`
        })
        return
    }

    else if (current_date > expired_date) {
        res.status(403).json({
            message: "No puedes obtener la preferencia de pago debido a que venció el plazo de la orden de compra."
        })
        return
    }

    const preference = await MercadoPagoService.getPreference(preference_id?.toString())
    if (!ErrorHandler.isInstanceOf(preference)) {
        const { init_point, date_of_expiration } = preference
        res.json({
            data: {
                init_point,
                date_of_expiration,
            }
        })
    }
    else {
        res.locals = {
            expired_date
        }
        next()
    }
}



export default verifyOrderPreference