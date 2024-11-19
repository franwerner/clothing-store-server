import DatabaseErrorHandler, { CustomSQLQueryErrorMessages } from "./databaseErrorHandler.utilts.js"

abstract class ModelUtils {

    static generateError(error: unknown, messages: CustomSQLQueryErrorMessages = {}) {
        if (DatabaseErrorHandler.isSqlError(error)) {
            return new DatabaseErrorHandler(error, messages)
        }
        return error
    }

}


export default ModelUtils