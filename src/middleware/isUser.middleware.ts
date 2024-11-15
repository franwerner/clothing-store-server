import { NextFunction, Request, Response } from "express"

const isUser = (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user
        if (!user) {
            res.status(401).json({
                message: "La sesión ha expirado o no existe, por favor inicia sesión nuevamente.",
            })
        }else {
            next()
        }
   
}


export default isUser