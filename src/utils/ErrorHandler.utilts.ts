import { Response } from "express"
import { ResponseToClient, ResponseDataInError } from "clothing-store-shared/types"

type OnlyResponseToClientError<T = any> = Omit<ResponseToClient, "data"> & { data?: ResponseDataInError<T> }

type ErrorHandlerProps<T = any> = {
    status?: number
} & OnlyResponseToClientError<T>

class ErrorHandler extends Error {
    message: string
    name: string
    status: number
    data: any
    code?: string

    constructor({ message, status, data, code }: ErrorHandlerProps) {
        super()
        this.message = message || ""
        this.name = "ErrorHandler",
        this.status = status && status >= 100 && status <= 599 ? status : 500
        this.data = data
        this.code = code || "err"
    }
    static isInstanceOf(instance: any): instance is ErrorHandler {
        return instance instanceof ErrorHandler
    }

    response<T = any>(res: Response<ResponseToClient<T>>) {
        res.status(this.status)
            .json({
                message: this.message || undefined,
                data: Array.isArray(this.data) ? this.data : [],
                code: this.code
            })
    }
}

export type { ErrorHandlerProps }
export default ErrorHandler