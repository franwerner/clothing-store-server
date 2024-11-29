import ErrorHandler from "./errorHandler.utilts.js"

type WriteOperationsHandlerResults<T> = Array<{
    success: boolean
    message?: any,
    payload: T
}>

class ServiceUtils {
    static async writeOperationsHandler<T,U>(
        input: T[], 
        operation: (value: T) => Promise<U>,
        logic?:(response:U) => void
    ) {
        const data: WriteOperationsHandlerResults<T> = [] 

        for (const e of input) {
            try {
                const res = await operation(e)
                logic && logic(res)
                data.push({
                    payload: e,
                    success: true
                })
            } catch (error) {
                data.push({
                    success: false,
                    payload: e,
                    message: ErrorHandler.isInstanceOf(error) ? error.message : "Error interno del servidor."
                })
            }
        }
        return data
    }
}

export {
    type WriteOperationsHandlerResults
}
export default ServiceUtils