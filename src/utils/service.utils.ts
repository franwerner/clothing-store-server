import ErrorHandler from "./errorHandler.utilts.js"
import { ResponseDataWriteOperationsInError } from "clothing-store-shared/types"

class ServiceUtils {
    static async writeOperationsHandler<T, U>(
        input: T[],
        operation: (value: T) => Promise<U>,
    ) {
        const errors: ResponseDataWriteOperationsInError<T> = []

        for (const e of input) {
            try {
                const r = await operation(e)

                if (!r) throw new ErrorHandler({
                    message: "El recurso que intentas modificar o eliminar no existe o ya ha sido modificado/eliminado previamente."
                })
            } catch (error) {
                errors.push({
                    source: e,
                    reason: ErrorHandler.isInstanceOf(error) ? error.message : (typeof error === "string" ? error : "Error desconocido."),
                })
            }
        }
        if (errors.length > 0) {
            throw new ErrorHandler({
                data: errors,
                code: "write_operation_failed",
                message: "Hubo errores en algunos datos entrantes."
            })
        }
    }
}


export default ServiceUtils