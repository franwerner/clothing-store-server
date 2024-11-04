import { QueryError } from "mysql2";
import ErrorHandler from "./ErrorHandler.utilts.js";

const sqlErrorMapping: { [key: string]: number } = {
    'ER_ACCESS_DENIED_ERROR': 401,
    'ER_BAD_DB_ERROR': 404,
    'ER_BAD_FIELD_ERROR': 400,
    'ER_SYNTAX_ERROR': 400,
    'ER_DUP_ENTRY': 409,
    'ER_LOCK_WAIT_TIMEOUT': 503,
    'CR_CONNECTION_REFUSED': 503,
};

class ErrorHandlerDataBase extends ErrorHandler {
    constructor(status: string ) {
        super({
            message: status,
            status: (sqlErrorMapping[status] || 500)
        })
        this.name = "Database"
    }

    static isInstanceOf(instance: any): instance is ErrorHandlerDataBase {
        return instance instanceof ErrorHandlerDataBase
    }

    static isSqlError(error: any): error is QueryError {
        return error?.sql
    }
}

export default ErrorHandlerDataBase