import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../../utils/errorHandler.utilts.js"

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.session.user
      if (user && user.permission == "standard") {
         throw new ErrorHandler({
            message: "No tienes permisos suficientes para continuar.",
            status: 403
         })
      }
      next()
   } catch (error) {
      if (ErrorHandler.isInstanceOf(error)) {
         error.response(res)
      }
   }
}

export default adminAuth