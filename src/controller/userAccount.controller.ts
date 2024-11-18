import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class UserAccountController {

    static passwordUpdate(
        _: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

          

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }
}


export default UserAccountController