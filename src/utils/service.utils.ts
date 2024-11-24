import DatabaseErrorHandler from "./databaseErrorHandler.utilts.js"

type WriteOperationsHandlerResults<T> = Array<{
    success: boolean
    message?: any,
    payload: T
}>

class ServiceUtils {
    static async writeOperationsHandler<T>(
        input: T[], 
        operation: (value: T) => void 
    ) {
        const data: WriteOperationsHandlerResults<T> = [] 

        for (const e of input) {
            try {
                await operation(e)
                data.push({
                    payload: e,
                    success: true
                })
            } catch (error) {
                data.push({
                    success: false,
                    payload: e,
                    message: DatabaseErrorHandler.isInstanceOf(error) ? error.message : "Error interno del servidor."
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