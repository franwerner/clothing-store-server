import session from "express-session";
import { Knex } from "knex";
import { Locals, Response } from "express";
import { UserSchema } from "clothing-store-shared/schema";
import { ResponseToClient } from "clothing-store-shared/types";
declare global {
    namespace APP {
        type SessionGlobal = session.Session & Partial<session.SessionData>
        type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder: Knex.QueryBuilder<TRecord, TResult>) => void
        type ResponseTemplate<T = any,U extends Locals = Locals> = Response<Omit<ResponseToClient<any,any,T>,"code">,U>
    }
}

declare module 'express-session' {
    interface SessionData {
        user: UserSchema.FormatUser,
    }
}

export { };

