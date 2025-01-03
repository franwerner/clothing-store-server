import ErrorHandler from "./errorHandler.utilts.js"
import {ResponseDataWriteOperationsInError} from "clothing-store-shared/types"

class ServiceUtils {
    static async writeOperationsHandler<T, U>(
        input: T[],
        operation: (value: T) => Promise<U>,
    ) {
        const errors: ResponseDataWriteOperationsInError<T> = []

        for (const e of input) {
            try {
               const r = await operation(e)
               if(!r) throw new ErrorHandler({
                     message: "Al parece hubo un error al intentar realizar la operación, ya que no se modifico nada.",
               })
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
}


export default ServiceUtils