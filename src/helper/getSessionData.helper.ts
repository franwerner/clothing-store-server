import { SessionData } from "express-session";
import ErrorHandler from "../utils/errorHandler.utilts.js";

const getSessionData = (keys:keyof Omit<SessionData,"cookie">,session:APP.SessionGlobal) => {
    const data = session[keys]
    if(!data) throw new ErrorHandler({
        status : 500,
        message : "Problemas internos para encontrar la session."
    })

    return data
}

export default getSessionData