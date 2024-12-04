import { NextFunction, Request } from "express";
import crypto from "crypto"
import _env from "../constant/_env.constant";
import ErrorHandler from "../utils/errorHandler.utilts";

const validateMercadoPagoWebhook = (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {

    const headers = req.headers
    const xSignature = headers['x-signature'] as string || ""
    const xRequestId = headers['x-request-id']

    const dataID = req.query["data.id"]

    const parts = xSignature.split(",")

    const [ts, hash] = parts.map(part => {
        const [key, value] = part.split('=')
        if (!value || !["ts", "v1"].includes(key)) return
        return value.trim()
    })

    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", _env.MP_WEB_HOOK_TOKEN)
    hmac.update(manifest)
    const sha = hmac.digest('hex')

    if (sha === hash) {
        next()
    } else {
        new ErrorHandler({
            message : "No estas autorizado a realizar esta operacion",
            status : 401
        }).response(res)
    }

}

export default validateMercadoPagoWebhook