import session from "express-session";
import { Knex } from "knex";
import { Locals, Response } from "express";
import { UserPurchaseProductSchema, UserSchema } from "clothing-store-shared/schema";
import { EditAuth, ProductInShopcart, ResponseToClient, Shopcart } from "clothing-store-shared/types";
import { RateLimitInfo } from "express-rate-limit";
declare global {
    namespace APP {
        type SessionGlobal = session.Session & Partial<session.SessionData>
        type ModifySQL<TRecord extends {} = any, TResult = any> = (queryBuilder: Knex.QueryBuilder<TRecord, TResult>) => void
        type ResponseTemplate<T = any, U extends Locals = Locals> = Response<ResponseToClient<T, any, any>, U>
    }
}

declare module "express" {
    interface Request {
        rateLimit?: RateLimitInfo
    }
}
declare module 'express-session' {
    interface SessionData {
        edit_authorization: EditAuth
        user_info: UserSchema.FormatUser,
        shopcart: Shopcart
    }
}

export { };

