import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"
type RequestType = "email_confirmation" | "email_update" | "password_update"


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

interface ExpiredConfig {
    type: "minute" | "hour" | "day" | "week",
    value: number,
    // max_tokens : number
}

const table_name = "user_tokens"

type SelectProps = Partial<UserToken>
class UserTokensModel extends ModelUtils {

    static select(props: SelectProps = {}) {
        return sql(table_name)
            .where(this.removePropertiesUndefined(props))
    }

    static selectNotExpiredTokens(props: SelectProps) {
        return this.select(props)
            .whereRaw("expired_at > NOW()")
    }

    static insertWithExpiration(props: UserToken, expired: ExpiredConfig) {
        const { type, value } = expired
        //Agregar le limite dinamico de tokens.
        return sql(table_name)
            .insert({
                ...props,
                expired_at: sql.raw(`DATE_ADD(CURRENT_TIMESTAMP,INTERVAL ${value} ${type})`)
            })
    }

    static deleteByToken(token:string) {
        return sql(table_name)
            .where("token", token)
            .delete()
    }

    static deleteAllExpiredTokens() {
        return sql(table_name)
            .whereRaw("expired_at < NOW()")
            .delete()
    }


}

export type {
    UserToken,
    RequestType,
    ExpiredConfig
}
export default UserTokensModel