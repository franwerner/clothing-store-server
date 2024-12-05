import session from "express-session";
import { Knex } from "knex";
import { Locals, Response } from "express";
import { UserSchema } from "./src/schema/user.schema";
declare global {
    namespace APP {
        type SessionGlobal = session.Session & Partial<session.SessionData>
        type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder: Knex.QueryBuilder<TRecord, TResult>) => void
        type ResponseTemplate<T = any,U extends Locals = Locals> = Response<{
            data?: T
            message?: string
        },U>
    }
}


declare module 'express-session' {
    interface SessionData {
        user: UserSchema.FormatUser,
    }
}

export { };

