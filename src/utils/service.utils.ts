import ErrorHandler, { ErrorHandlerData } from "./errorHandler.utilts.js"

type WriteOperationsHandlerResults<T> = ErrorHandlerData<T>

class ServiceUtils {
    static async writeOperationsHandler<T, U>(
        input: T[],
        operation: (value: T) => Promise<U>,
        logic?: (response: U) => void
    ) {
        const errors: WriteOperationsHandlerResults<T> = []

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
                code: `${code}_failed`,
                status: 206
            })
        }
    }
    static  genericMessage({text,action}:{text:string,action:"eliminar" | "actualizar"}){
      return `Al parecer ${text} que intentas ${action} no existe.`
    }
}

export {
    type WriteOperationsHandlerResults
}
export default ServiceUtils