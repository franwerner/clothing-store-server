import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

type RequestType = "register_confirm" | "email_update" | "password_update"

interface UserToken {
    id_user_token?: KEYDB
    request: RequestType
    token: string
    ip: string
    used?: boolean
    user_fk: KEYDB
    expired_at?: string
    created_at?: string
}

type UserTokenKeys = keyof UserToken

const table_name = "user_tokens"

type PartialProps = Partial<UserToken>
class UserTokensModel extends ModelUtils {

    static async select<T extends UserTokenKeys = UserTokenKeys>(props: PartialProps = {}, modify?: ModifySQL<UserToken>) {
        try {
            const query = sql<UserToken>(table_name)
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectActiveToken<T extends UserTokenKeys = UserTokenKeys>(props: PartialProps, modify?: ModifySQL<UserToken>) {
        try {
            return await this.select<T>(props, (builder) => {
                builder
                    .whereRaw("expired_at > NOW()")
                    .where("used", false)
                modify && builder.modify(modify)
            })
        } catch (error) {
            throw this.generateError(error)
        }

    }

    static async insertWithExpiration(props: UserToken, tokenLimit: number) {

        try {
            const { request, ip, token, user_fk, expired_at } = props

            const parametersForInsert = [request, token, ip, user_fk, expired_at]
            const parametersForSubQuery = [request, user_fk, tokenLimit]
            const query = await sql.raw(`INSERT INTO user_tokens (request,token,ip,user_fk,expired_at)
          SELECT ?, ?, ?, ?, ?
          WHERE (SELECT COUNT(*) FROM user_tokens WHERE request = ? AND user_fk = ?) < ?
          `, [
                ...parametersForInsert,
                ...parametersForSubQuery
            ])
            return query as Array<ResultSetHeader>
        } catch (error) {
            throw this.generateError(error)
        }
    }


    static async updateToken({ token, ...userToken }: PartialProps, modify?: ModifySQL) {
        try {
            const query = sql(table_name)
                .update(userToken)
                .where("token", token)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async updateNotUsedToken(props: PartialProps) {
        try {
            return await this.updateToken(props, (builder) => {
                builder.where("used", false)
            })

        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async deleteAllExpiredTokens() {
        try {
            return await sql(table_name)
                .whereRaw("expired_at < NOW()")
                .orWhere("used", true)
                .delete()
        } catch (error) {
            throw this.generateError(error)
        }
    }


}

export type {
    RequestType, UserToken
}
export default UserTokensModel