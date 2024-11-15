import session from "express-session";
import FormatUser from "./src/types/formatUser.types";

declare global {
    type KEYDB = number | string
    type SessionGlobal = session.Session & Partial<session.SessionData>
}

declare module 'express-session' {
    interface SessionData {
        user : FormatUser
    }
}

export { };

