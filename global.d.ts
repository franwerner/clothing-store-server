import session from "express-session";
import FormatUser from "./src/types/formatUser.types";
import { Knex } from "knex";

declare global {
    type KEYDB = number | string
    type SessionGlobal = session.Session & Partial<session.SessionData>
    type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder:Knex.QueryBuilder<TRecord,TResult>) => void
}

declare module 'express-session' {
    interface SessionData {
        user : FormatUser
    }
}

export { };

