import { ResultSetHeader } from "mysql2"
import sql from "../config/knex.config.js"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"
import { UserTokenSchema } from "clothing-store-shared/schema"

type UserTokenPartial = Partial<UserTokenSchema.Base>

class UserTokensModel extends ModelUtils {

    static async select
        (props: UserTokenPartial = {},
            modify?: APP.ModifySQL
        ) {
        try {
            const query = sql("user_tokens as ut")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static selectActiveToken(
        props?: UserTokenPartial,
        modify?: APP.ModifySQL
    ) {
        return this.select(props, (builder) => {
            builder
                .whereRaw("expired_at > NOW()")
                .where("used", false)
            modify && builder.modify(modify)
        })
    }

    static async insertWithTokenLimit<T extends UserTokenSchema.Insert>(
        props: Exact<T, UserTokenSchema.Insert>,
        tokenLimit: number
    ) {

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


    static async update<T extends UserTokenSchema.Update>(
        { token, ...userToken }: Exact<T, UserTokenSchema.Update>,
        modify?: APP.ModifySQL
    ) {
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

export default UserTokensModel