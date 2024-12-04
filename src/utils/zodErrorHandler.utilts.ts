import { z, ZodError } from "zod";
import ErrorHandler from "./errorHandler.utilts.js";

function transformErrorToClient(zod_error: ZodError) {
    return zod_error.issues.map(({ message, path, code }) => {
        return {
            source: path.find(i => typeof i === "string") || code,
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
            code: "zod_error"
        })
        this.zod_error = error
    }

    static isZodError(error: unknown): error is ZodError {
        return error instanceof ZodError
    }


}

export default ZodErrorHandler

