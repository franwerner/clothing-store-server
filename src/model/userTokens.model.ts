import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

type RequestType = "register_confirm" | "email_update" | "password_update"
interface UserToken {
    user_token_id: KEYDB
    user_fk: KEYDB
    request: RequestType
    token: string
    ip: string
    expired_at: string
    used?: boolean
    created_at?: string
}

type UserTokenKeys = keyof UserToken
type UserTokenPartial = Partial<UserToken>
type UserTokenRequired = Required<UserToken>
type UserTokenInsert = Omit<UserToken, "user_token_id">
type UserTokenUpdate = Omit<UserTokenPartial, "user_token_id"> & { token: string }

class UserTokensModel extends ModelUtils {

    static async select<T extends UserTokenKeys = UserTokenKeys>
        (props: UserTokenPartial = {},
            modify?: ModifySQL<Pick<UserTokenRequired, T>>
        ) {
        try {
            const query = sql<Pick<UserTokenRequired, T>>("user_tokens as ut")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectActiveToken<T extends UserTokenKeys = UserTokenKeys>(
        props?: UserTokenPartial,
        modify?: ModifySQL<Pick<UserTokenRequired, T>>
    ) {
        return this.select<T>(props, (builder) => {
            builder
                .whereRaw("expired_at > NOW()")
                .where("used", false)
            modify && builder.modify(modify)
        })


    }

    static async insertWithExpiration(props: UserTokenInsert, tokenLimit: number) {

        try {
            const { request, ip, token, user_fk, expired_at } = props

            const parametersForInsert = [request, token, ip, user_fk, expired_at]
            const parametersForSubQuery = [request, user_fk, tokenLimit]
            const query = await sql.raw<Array<ResultSetHeader>>(`
                INSERT INTO user_tokens (request,token,ip,user_fk,expired_at)
                SELECT ?, ?, ?, ?, ?
                WHERE (SELECT COUNT(*) FROM user_tokens WHERE request = ? AND user_fk = ?) < ?`,
                [
                    ...parametersForInsert,
                    ...parametersForSubQuery
                ]
            )
            return query
        } catch (error) {
            throw this.generateError(error)
        }
    }


    static async updateToken({ token, ...userToken }: UserTokenUpdate, modify?: ModifySQL) {
        try {
            const query = sql("user_tokens")
                .update(userToken)
                .where("token", token)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static updateNotUsedToken(props: UserTokenUpdate) {
        return this.updateToken(props, (builder) => {
            builder.where("used", false)
        })
    }

    static async deleteAllExpiredTokens() {
        try {
            return await sql("user_tokens")
                .whereRaw("expired_at < NOW()")
                .orWhere("used", true)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }

}

export type {
    RequestType,
    UserToken
}
export default UserTokensModel