import { Response } from "express";
import { z, ZodError } from "zod";

class ZodErrorHandler extends ZodError {
    constructor(error: z.ZodError) {
        super(error.errors)
    }

    static isInstanceOf(error: unknown): error is ZodError {
        return error instanceof ZodError
    }

    transformErrorToClient() {
        return this.issues.map(({ message, path, code }) => {
            return {
                property: path[1],
                code,
                message,
            }
        })
    }

    response(res: Response) {
        res.status(400).json(this.transformErrorToClient())
    }
}

export default ZodErrorHandler