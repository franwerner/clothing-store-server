import DatabaseErrorHandler, { CustomSQLQueryErrorMessages } from "./databaseErrorHandler.utilts.js"
import ErrorHandler from "./errorHandler.utilts.js"

abstract class ModelUtils {

    static generateError(error: unknown, messages: CustomSQLQueryErrorMessages = {}) {
        if (DatabaseErrorHandler.isSqlError(error)) {
            throw new DatabaseErrorHandler(error, messages)
        }
        else {
            throw new ErrorHandler({
                code: "SQL_ERROR",
                message: "Ocurrio un error desconocido en la base de datos.",
                status: 500
            })
        }
    }

}


export default ModelUtils