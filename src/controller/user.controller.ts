import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

class UserController {

    static post(req: Request, res: Response, next: NextFunction) {
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


export default UserController