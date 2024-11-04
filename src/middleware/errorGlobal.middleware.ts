import { Request, Response } from "express"

const errorGlobal = (req: Request, res: Response) => {

    res.status(500).json({
        message: "Internal Server Error",
        status: 500
    })
}
export default errorGlobal