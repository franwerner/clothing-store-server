import { NextFunction, Request } from "express"
import ErrorHandler from "../utils/errorHandler.utilts"

const isAdmin = (req: Request, res: APP.ResponseTemplate, next: NextFunction) => {
   const user = req.session.user_info
   if (user && user.permission == "admin") {
      next()
   }
   else {
     new ErrorHandler({
      message : "No estas autorizado para continuar con esta operacion.",
      status : 401,
      code : "session_unauthorized"
     }).response(res)
   }

}

export default isAdmin