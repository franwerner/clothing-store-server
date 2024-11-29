import { z, ZodError } from "zod";
import ErrorHandler from "./errorHandler.utilts.js";

function transformErrorToClient(zod_error:ZodError) {
    return zod_error.issues.map(({ message, path }) => {
        return {
            property: path.find(i => typeof i === "string"),
            message,
        }
    })
}

class ZodErrorHandler extends ErrorHandler {
    zod_error: z.ZodError
    constructor(error: z.ZodError) {
        super({
            status: 400,
            data : transformErrorToClient(error)
        })
        this.zod_error = error
    }

    static isZodError(error: unknown): error is ZodError {
        return error instanceof ZodError
    }

    
}

export default ZodErrorHandler