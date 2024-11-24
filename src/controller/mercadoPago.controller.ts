import { NextFunction, Request } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";
import MercadoPagoService from "../service/mercadoPago.service";

class MercadoPagoController {

    static async notification(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await MercadoPagoService.paymentHandler(req.body)
            res.status(201).json({ message: "success" })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

}

export default MercadoPagoController