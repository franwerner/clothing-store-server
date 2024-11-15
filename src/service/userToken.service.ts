import crypto from "crypto";
import UserTokensModel, { RequestType } from "../model/userTokens.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import { ResultSetHeader } from "mysql2";
import getAdjustedUTCDate from "../utils/getAdjustedUTCDate.utils.js";

interface TokenDate {
    timeUnit: "minute" | "hour" | "day",
    timeValue: number,
}

class UserTokenService {

    static createTokenDate({ timeUnit, timeValue }: TokenDate) {
        const date = getAdjustedUTCDate(-3)
        if (timeUnit == "day") {
            date.setUTCDate(date.getUTCDate() + timeValue)
        } else if (timeUnit == "hour") {
            date.setUTCHours(date.getUTCHours() + timeValue)
        } else {
            date.setUTCMinutes(date.getUTCMinutes() + timeValue)
        }
        return date.toISOString().replace('T', ' ').substring(0, 19) //Quitamos para que se adapte el CURRENT_TIMESTAMP DE MYSQL
    }

    static async createToken(props: { ip: string, request: RequestType, user_fk: KEYDB }, { maxTokens, ...tokenDate }: TokenDate & { maxTokens: number }) {

        const token = crypto.randomUUID()

        const [ResultSetHeader] = await UserTokensModel.insertWithExpiration({
            ...props,
            token,
            expired_at: this.createTokenDate(tokenDate)
        },
            maxTokens
        )

        if (ResultSetHeader.affectedRows == 0) {
            throw new ErrorHandler({
                status: 429,
                message: "Se ha excedido el límite de solicitudes de generación de tokens para este usuario."
            })
        }

        return token
    }

    static async useToken(token: string) {
        const [user] = await UserTokensModel.selectActiveToken({ token }, (builder) => builder.select("user_fk"))

        if (!user) {
            throw new ErrorHandler({
                status: 404,
                message: `El token que estás intentando utilizar ha expirado`
            })
        }

        await UserTokensModel.updateNotUsedToken({ token, used: true })

        return user.user_fk
    }

    static async cleanExpiredTokens({ cleaning_hour, cleaning_minute }: { cleaning_hour: number, cleaning_minute: number }) {

        if (cleaning_hour > 23 || cleaning_hour < 0 || cleaning_minute > 60 || cleaning_minute < 0) {
            console.log("The expired token cleanup process failed to initialize due to incorrect time range data.")
            return
        }

        const current_date = getAdjustedUTCDate(-3)
        const expected_date = getAdjustedUTCDate(-3)

        expected_date.setUTCHours(cleaning_hour)
        expected_date.setUTCMinutes(cleaning_minute)
        expected_date.setUTCSeconds(0)

        if (expected_date.getTime() - current_date.getTime() <= 0) {
            expected_date.setUTCDate(expected_date.getUTCDate() + 1)
        }
        const milliseconds = (expected_date.getTime() - current_date.getTime())

        const hours = Math.floor(milliseconds / 3600000)
        const minutes = Math.ceil((milliseconds % 3600000) / 60000)

        const cleanCount = await UserTokensModel.deleteAllExpiredTokens()

        console.log(`${cleanCount} tokens were cleaned`)

        console.log(`The next token cleanup is in ${hours}H ${minutes}M`)

        setTimeout(async () => {
            this.cleanExpiredTokens({ cleaning_hour, cleaning_minute })
        }, milliseconds)
    }

}


export default UserTokenService