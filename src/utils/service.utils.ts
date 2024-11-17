import DatabaseErrorHandler from "./databaseErrorHandler.utilts.js"

class ServiceUtils {

    static async writeOperationsHandler<T>(
        input: T[], 
        operation: (value: T) => void 
    ) {
        const data: APP.WriteOperationsHandlerResults<T> = [] 

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


export default ServiceUtils