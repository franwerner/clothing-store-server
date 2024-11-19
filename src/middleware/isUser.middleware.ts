import { NextFunction, Request, Response } from "express"

const isUser = (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user
        if (user) {
            next()
        }else {
            res.status(401).json({
                message: "La sesión ha expirado, por favor inicia sesión nuevamente.",
            })
        }
   
}


export default isUser