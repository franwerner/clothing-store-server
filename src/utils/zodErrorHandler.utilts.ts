import { z, ZodError } from "zod";
import ErrorHandler from "./errorHandler.utilts.js";

function transformErrorToClient(zod_error: ZodError) {
    const formErrors = zod_error.formErrors
    if(formErrors.formErrors.length === 0) return formErrors.fieldErrors
    else return formErrors.formErrors 
}
class ZodErrorHandler extends ErrorHandler {
    zod_error: z.ZodError
    constructor(error: z.ZodError) {
        super({
            status: 400,
            data: transformErrorToClient(error),
            code: "zod_err",
            message: "Los datos ingresados no tienen el formato esperado."
        })
        this.zod_error = error
    }

    static isZodError(error: unknown): error is ZodError {
        return error instanceof ZodError
    }

}

export default ZodErrorHandler

