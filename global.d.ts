import session from "express-session";
import FormatUser from "./src/types/formatUser.types";
import { Knex } from "knex";
import { Response } from "express";
declare global {
    namespace APP {
        type SessionGlobal = session.Session & Partial<session.SessionData>
        type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder: Knex.QueryBuilder<TRecord, TResult>) => void
        type WriteOperationsHandlerResults<T> = Array<{
            success: boolean
            message?: any,
            payload: T
        }>
        type ResponseTemplate<T> = Response<{
            data?: T
            message?: string
        }>
        type ResponseTemplateWithWOR<T> = ResponseTemplate<WriteOperationsHandlerResults<T>>
    }
}

declare module 'express-session' {
    interface SessionData {
        user: FormatUser
    }
}

export { };

