import { NextFunction, Request, Response } from "express";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { parseDate } from "my-utilities";

const isAuthorizedToUpdateInfo = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const edit_expiration = req.session.edit_expiration || 0

    if (!edit_expiration || new Date() > parseDate(edit_expiration)) new ErrorHandler({
        code: "not_edit_authorized",
        message: "No estas autorizado para editar la informacion de la cuenta.",
        status: 401
    }).response(res)
    else {
        next()
    }

}

export default isAuthorizedToUpdateInfo