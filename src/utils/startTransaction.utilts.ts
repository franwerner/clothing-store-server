import sql from "../config/knex.config"
import ErrorHandler from "./errorHandler.utilts"

const startTransaction  = async () => {
    try {
        return await sql.transaction()
    } catch (error) {
        throw new ErrorHandler({
            code: "transaction_not_failed",
            status: 500,
            message: "No se pudo iniciar la transacción."
        })
    }
}

export default startTransaction 