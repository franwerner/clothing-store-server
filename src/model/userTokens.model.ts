import sql from "../database/index.js"
type RequestType = "email_confirmation" | "email_update" | "password_update"


interface UserToken {
    id_user_token?: number
    request: RequestType
    token: string
    ip: string
    used?: boolean
    user_fk: number
    expired_at?: string
    created_at?: string
}

interface ExpiredConfig {
    type: "minute" | "hour" | "day" | "week",
    value: number
}

const table_name = "user_tokens"

class UserTokensModel {

    static select({ token }: { token: string }) {
        return sql(table_name)
            .where("token", token)
    }

    static insert(props: UserToken, expired: ExpiredConfig) {
        const { type = "minute", value = 1 } = expired
        return sql(table_name)
            .insert({
                ...props,
                expired_at: sql.raw(`DATE_ADD(CURRENT_TIMESTAMP,INTERVAL ${value} ${type})`)
            })
    }

}

export type {
    UserToken,
    RequestType,
    ExpiredConfig
}
export default UserTokensModel