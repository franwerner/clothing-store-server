import { ResponseToClientError } from "clothing-store-shared/types"
import { Response } from "express"


type ErrorHandlerProps = {
    status?: number
} & ResponseToClientError<any>

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
    log() {
        console.log(this.stack)
    }
    response<T extends any>(res: Response<ResponseToClientError<T>>) {
        res.status(this.status)
            .json({
                message: this.message || undefined,
                data: this.data,
                code: this.code
            })
    }
}

export type { ErrorHandlerProps }
export default ErrorHandler