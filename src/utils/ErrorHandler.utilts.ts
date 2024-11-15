import { Response } from "express"

interface ErrorHandlerProps {
    message: string
    status: number
    data?: any
    code?: any
}

class ErrorHandler extends Error {
    message: string
    name: string
    status: number
    data: any
    code: string

    constructor({ message, status, data,code }: ErrorHandlerProps) {
        super()
        this.message = message
        this.name = "ErrorHandler",
            this.status = status || 500
        this.data = data
        this.code = code || ""
    }
    static isInstanceOf(instance: any): instance is ErrorHandler {
        return instance instanceof ErrorHandler
    }

    log() {
        console.log(`
            ${this.status}
             ${this.name}
             ${this.message}
            `)
    }


    response(res: Response) {
        res.status(this.status)
            .json({
                message: this.message,
                data: this.data
            })
    }
}




export type { ErrorHandlerProps }
export default ErrorHandler