import { NextFunction, Request, Response } from "express"

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
   const user = req.session.user
   if (user && user.permission == "admin") {
      next()
   }
   else {
      res.status(401).json({
         message: "No estas autorizado para continuar con esta operacion.",
      })
   }

}

export default isAdmin