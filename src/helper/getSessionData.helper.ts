import { SessionData } from "express-session";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

const getSessionData = (keys:keyof Omit<SessionData,"cookie">,session:SessionGlobal) => {
    const data = session[keys]
    if(!data) throw new ErrorHandler({
        status : 500,
        message : "Problemas internos para encontrar la session."
    })

    return data
}

export default getSessionData