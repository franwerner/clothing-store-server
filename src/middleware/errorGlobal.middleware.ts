import { Request, Response } from "express"
import ErrorHandler from "../utils/errorHandler.utilts"

const errorGlobal = (_: Request, res: Response) => {
    new ErrorHandler({
        status : 500,
        message : "Ocurrió un error inesperado en el servidor.",
        code : "internal"
    }).response(res)
}
export default errorGlobal