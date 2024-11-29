import crypto from "crypto";
import zodParse from "../helper/zodParse.helper.js";
import UserTokensModel from "../model/userTokens.model.js";
import userTokenSchema, { UserTokenSchema } from "../schema/token.schema.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import getAdjustedUTCDate from "../utils/getAdjustedUTCDate.utils.js";

interface TokenDate {
    timeUnit: "minute" | "hour" | "day",
    timeValue: number,
}

interface CreateToken extends TokenDate {
    maxTokens: number
}

interface Token { token: string, request: UserTokenSchema.RequestToken }


class UserTokenService {

    private static createTokenDate({ timeUnit, timeValue }: TokenDate) {
        const date = new Date()
        if (timeUnit == "day") {
            date.setUTCDate(date.getUTCDate() + timeValue)
        } else if (timeUnit == "hour") {
            date.setUTCHours(date.getUTCHours() + timeValue)
        } else {
            date.setUTCMinutes(date.getUTCMinutes() + timeValue)
        }
        return date.toISOString().replace('T', ' ').substring(0, 19) //Quitamos para que se adapte el CURRENT_TIMESTAMP DE MYSQL
    }

    static async createToken(props:
        Omit<UserTokenSchema.Insert, "expired_at" | "token">,
        { maxTokens, ...tokenDate }: CreateToken
    ) {
        const token = crypto.randomUUID()
        const data = zodParse(userTokenSchema.insert)({
            ...props,
            token,
            expired_at: this.createTokenDate(tokenDate)
        })
        const [ResultSetHeader] = await UserTokensModel.insertWithTokenLimit(data, maxTokens)
        if (ResultSetHeader.affectedRows == 0) {
            throw new ErrorHandler({
                status: 429,
                message: `Se ha excedido el límite de ${maxTokens} solicitudes de generación de tokens para este usuario.`
            })
        }
        return data.token
    }

    static async findActiveTokenByToken({ token, request }: Token) {

        const requestValidated = zodParse(userTokenSchema.requestTokenSchema)(request)

        const [user] = await UserTokensModel.selectActiveToken<"user_fk">({ token, request: requestValidated }, (builder) => builder.select("user_fk"))
        if (!user) {
            throw new ErrorHandler({
                status: 404,
                message: `El token que estás intentando utilizar ha expirado.`
            })
        }
        return user
    }


    static async markTokenAsUsed(token: string) {
        return await UserTokensModel.update({ used: true, token })
    }

    static async useToken(data: Token) {

        const userToken = await this.findActiveTokenByToken(data)
        await this.markTokenAsUsed(data.token)

        return userToken.user_fk
    }

    static async cleanExpiredTokens({ cleaning_hour, cleaning_minute }: { cleaning_hour: number, cleaning_minute: number }) {

        if (cleaning_hour > 23 || cleaning_hour < 0 || cleaning_minute > 60 || cleaning_minute < 0) {
            console.log("The expired token cleanup process failed to initialize due to incorrect time range data.")
            return
        }

        const current_date = new Date()
        const expected_date = new Date()

        expected_date.setUTCHours(cleaning_hour)
        expected_date.setUTCMinutes(cleaning_minute)

        if (current_date.getTime() >= expected_date.getTime()) {
            expected_date.setUTCDate(expected_date.getUTCDate() + 1)
        }
        
        const milliseconds = (expected_date.getTime() - current_date.getTime())

        const hours = Math.floor(milliseconds / 3600000)
        const minutes = Math.ceil((milliseconds % 3600000) / 60000)

        try {
            const cleanCount = await UserTokensModel.deleteAllExpiredTokens()

            console.log(`${cleanCount} tokens were cleaned`)

            console.log(`The next token cleanup is in ${hours}H ${minutes}M`)

            setTimeout(() => {
                this.cleanExpiredTokens({ cleaning_hour, cleaning_minute })
            }, milliseconds)
        } catch (error) {
            console.error("Error crítico: Fallo al intentar eliminar los tokens expirados. Se requiere atención inmediata.")
        }
    }

}

export { type CreateToken };

export default UserTokenService