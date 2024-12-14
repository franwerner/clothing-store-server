import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.utilts";

const isAuthorizedToUpdateInfo = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const edit_authorization = req.session.edit_authorization

    if (!edit_authorization || Date.now() > edit_authorization.expired_at || !edit_authorization.isAuthorized)  new ErrorHandler({
        code: "not_edit_authorized",
        message: "No estas autorizado para editar la informacion de la cuenta.",
        status: 401
    }).response(res)
    else {
        next()
    }

}

export default isAuthorizedToUpdateInfo