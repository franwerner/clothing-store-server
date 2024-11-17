import DatabaseErrorHandler, { CustomSQLQueryErrorMessages } from "./databaseErrorHandler.utilts.js"

abstract class ModelUtils {

    static removePropertiesUndefined<T extends object>(properties: T) {
        return Object.fromEntries(Object.entries(properties).filter(([_, value]) => value))
    }

    static generateError(error: unknown, messages: CustomSQLQueryErrorMessages = {}) {
        if (DatabaseErrorHandler.isSqlError(error)) {
            return new DatabaseErrorHandler(error, messages)
        }
        return error
    }

}


export default ModelUtils