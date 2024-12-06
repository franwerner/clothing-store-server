import { z, ZodError } from "zod";
import ErrorHandler from "./errorHandler.utilts.js";
import { ResponseDataZodInError } from "clothing-store-shared/types";

function transformErrorToClient(zod_error: ZodError): ResponseDataZodInError<any> {
    return zod_error.issues.map(({ message, path, code }) => {
        return {
            source: path.length > 0 ? path : [code],
            reason: message,
        }
    })
}

class ZodErrorHandler extends ErrorHandler {
    zod_error: z.ZodError
    constructor(error: z.ZodError) {
        super({
            status: 400,
            data: transformErrorToClient(error),
            code: "zod_err"
        })
        this.zod_error = error
    }

    static isZodError(error: unknown): error is ZodError {
        return error instanceof ZodError
    }

}

export default ZodErrorHandler

