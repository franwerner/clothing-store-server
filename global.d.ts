import session from "express-session";
import { Knex } from "knex";
import { Response } from "express";
import { UserSchema } from "./src/schema/user.schema";
declare global {
    namespace APP {
        type SessionGlobal = session.Session & Partial<session.SessionData>
        type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder: Knex.QueryBuilder<TRecord, TResult>) => void
        type WriteOperationsHandlerResults<T> = Array<{
            success: boolean
            message?: any,
            payload: T
        }>
        type ResponseTemplate<T = any> = Response<{
            data?: T
            message?: string
        }>
        type ResponseTemplateWithWOR<T> = ResponseTemplate<WriteOperationsHandlerResults<T>>
    }
}


declare module 'express-session' {
    interface SessionData {
        user: UserSchema.FormatUser
    }
}

export { };

