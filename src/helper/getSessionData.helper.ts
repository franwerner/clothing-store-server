import { SessionData } from "express-session";
import ErrorHandler from "../utils/errorHandler.utilts.js";

const getSessionData = <
    T extends keyof Omit<SessionData, "cookie">,
    S extends APP.SessionGlobal | Record<string, any> = APP.SessionGlobal
>(
    keys: T,
    session: S
) => {
    const data = session[keys];
    
    if (!data) {
        throw new ErrorHandler({
            status: 500,
            message: "Problemas internos para encontrar la session.",
        });
    }

    return data
};

export default getSessionData