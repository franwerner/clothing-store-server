import { Response } from "express"

type ErrorHandlerData<T = any> = Array<{source:T,reason ?: string}>

interface ErrorHandlerProps<T = any> {
    message?: string
    status?: number
    data?: ErrorHandlerData<T>
    code?: string
}



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
        this.code = `err_${code}`
    }
    static isInstanceOf(instance: any): instance is ErrorHandler {
        return instance instanceof ErrorHandler
    }

    response(res:Response) {
        res.status(this.status)
            .json({
                message: this.message || undefined,
                data: this.data,
                code: this.code 
            })
    }
}




export type { ErrorHandlerProps,ErrorHandlerData}
export default ErrorHandler