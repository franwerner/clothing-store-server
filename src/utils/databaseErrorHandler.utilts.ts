import { QueryError } from "mysql2";
import ErrorHandler from "./errorHandler.utilts.js";

type SlqErrorKeys = keyof typeof sqlErrorMapping

type CustomSQLQueryErrorMessages = {
    [K in SlqErrorKeys]?: string
}
const sqlErrorMapping = {
    'ER_ACCESS_DENIED_ERROR': 401,
    'ER_BAD_DB_ERROR': 404,
    'ER_BAD_FIELD_ERROR': 400,
    'ER_SYNTAX_ERROR': 400,
    'ER_DUP_ENTRY': 409,
    'ER_LOCK_WAIT_TIMEOUT': 503,
    'CR_CONNECTION_REFUSED': 503,
    'ER_NO_SUCH_TABLE': 404,
    'ER_ROW_IS_REFERENCED_2': 409,
    "ER_NO_REFERENCED_ROW_2" : 400,
    'ER_WARN_DATA_OUT_OF_RANGE': 422,
    'ER_UNKNOWN_ERROR': 500,
    'ER_TIMEOUT': 408,
    'ER_TOO_MANY_CONCURRENT_CONNECTIONS': 503,
    'ER_BAD_NULL_ERROR': 400,
    'ER_OUTOFMEMORY': 500,
    'ER_INVALID_GROUP_FUNC_MIN_MAX': 400,
    'ER_SUBQUERY_NO_1_ROW': 400,
}

const defaultMessage = "Ocurrio un error desconocido en la base de datos."

class DatabaseErrorHandler extends ErrorHandler {

    queryError: QueryError
    
    constructor(queryError: QueryError, messages: CustomSQLQueryErrorMessages = {}) {
        super({
            message: messages[queryError.code as SlqErrorKeys] || defaultMessage,
            status: (sqlErrorMapping[queryError.code as SlqErrorKeys]),
            code : `SQL_${queryError.code}`,
        })
        this.queryError = queryError
        this.name = "DatabaseErrorHandler"
    }

    static isSqlError(error: any): error is QueryError {
        return error?.sql
    }

    static isInstanceOf(instance: any): instance is DatabaseErrorHandler {
        return instance instanceof DatabaseErrorHandler
    }

}

export type {
    CustomSQLQueryErrorMessages
}
export default DatabaseErrorHandler