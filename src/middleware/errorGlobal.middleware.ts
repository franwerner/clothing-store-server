import { Request, Response } from "express"

const errorGlobal = (req: Request, res: Response) => {

    res.status(500).json({
        message: "Ocurrió un error inesperado en el servidor.",
    })
}
export default errorGlobal