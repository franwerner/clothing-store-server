import { Response } from "express"




interface ErrorHandlerProps {
    message: string
    status: number
}

class ErrorHandler extends Error {
    message: string
    name: string
    status: number

    constructor({ message, status }: ErrorHandlerProps) {
        super()
        this.message = message
        this.name = "genericError",
            this.status = status || 500
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
                status: this.status,
                message: this.message
            })
    }
}




export type { ErrorHandlerProps }
export default ErrorHandler