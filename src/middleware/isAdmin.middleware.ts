import { NextFunction, Request, Response } from "express"

const isAdmin =  (req: Request, res: Response, next: NextFunction) => {
      const user = req.session.user
      if (!user || user.permission == "standard") {
         res.status(403).json({
            message: "No tienes permisos suficientes para continuar.",
         })
      }
      else {
         next()
      }
 
}

export default isAdmin