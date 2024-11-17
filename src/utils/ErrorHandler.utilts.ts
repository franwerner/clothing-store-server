
interface ErrorHandlerProps {
    message: string
    status: number
    data?: any
}

class ErrorHandler extends Error {
    message: string
    name: string
    status: number
    data: any

    constructor({ message, status, data }: ErrorHandlerProps) {
        super()
        this.message = message
        this.name = "ErrorHandler",
            this.status = status || 500
        this.data = data
    }
    static isInstanceOf(instance: any): instance is ErrorHandler {
        return instance instanceof ErrorHandler
    }

    response<T extends ResponseBodyTemplate<any>>(res: T) {
        res.status(this.status)
            .json({
                message: this.message,
                data: this.data,
            })
    }
}




export type { ErrorHandlerProps }
export default ErrorHandler