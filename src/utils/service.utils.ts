import ErrorHandler from "./errorHandler.utilts.js"
import {ResponseDataWriteOperationsInError} from "clothing-store-shared/types"

class ServiceUtils {
    static async writeOperationsHandler<T, U>(
        input: T[],
        operation: (value: T) => Promise<U>,
        logic?: (response: U) => void
    ) {
        const errors: ResponseDataWriteOperationsInError<T> = []

        for (const e of input) {
            try {
                const res = await operation(e)
                logic && logic(res)
            } catch (error) {
                errors.push({
                    source: e,
                    reason: ErrorHandler.isInstanceOf(error) ? error.message : (typeof error === "string" ? error : "Error desconocido."),
                })
            }
        }

        return (code: string) => {
            if (errors.length > 0) throw new ErrorHandler({
                data: errors,
                code: `${code}_write_failed`,
                status: 206
            })
        }
    }
    static  genericMessage({text,action}:{text:string,action:"eliminar" | "actualizar"}){
      return `Al parecer ${text} que intentas ${action} no existe.`
    }
}


export default ServiceUtils