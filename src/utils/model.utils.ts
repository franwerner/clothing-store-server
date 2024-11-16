import ErrorHandlerDataBase, { CustomSQLQueryErrorMessages } from "./ErrorHandlerDataBase.utilts.js"

abstract class ModelUtils {

    static removePropertiesUndefined<T extends object>(properties: T) {
        return Object.fromEntries(Object.entries(properties).filter(([_, value]) => value))
    }

    static generateError(error: unknown, messages: CustomSQLQueryErrorMessages = {}) {
        if (ErrorHandlerDataBase.isSqlError(error)) {
            return new ErrorHandlerDataBase(error, messages)
        }
        return error
    }

}


export default ModelUtils