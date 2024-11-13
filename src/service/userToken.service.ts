import crypto from "crypto";
import UserTokensModel, { ExpiredConfig, RequestType } from "../model/userTokens.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

class UserTokenService {

    static async createToken(props: { ip: string, request: RequestType, user_fk: KEYDB }, expiredConfig: ExpiredConfig) {

        const token = crypto.randomUUID()

        const res = await UserTokensModel.insertWithExpiration({
            ...props,
            token,
        },
            expiredConfig
        )

        if (res.length == 0) {
            throw new ErrorHandler({
                status: 429,
                message: "Se ha excedido el límite de solicitudes de generación de tokens para este usuario en el día."
            })

        }

        return token
    }

    static async useToken(token: string) {
        const [user] = await UserTokensModel.selectNotExpiredTokens({ token })
            .select("user_fk") as Array<{ user_fk: KEYDB }>

        if (!user) {
            throw new ErrorHandler({
                status: 404,
                message: `El token que estás intentando utilizar ha expirado`
            })
        }

        await UserTokensModel.deleteByToken(token)

        return user.user_fk
    }

    static cleanExpiredTokens({ cleaning_hour, cleaning_minute }: { cleaning_hour: number, cleaning_minute: number }) {

        if (cleaning_hour > 23 || cleaning_hour < 0 || cleaning_minute > 60 || cleaning_minute < 0) {
            console.log("The expired token cleanup process failed to initialize due to incorrect time range data.")
            return
        }

        const UTC_ARG = -3

        const date = new Date()
        date.setUTCHours(date.getUTCHours() + UTC_ARG)

        const hour = date.getUTCHours() - cleaning_hour
        const minutes = date.getUTCMinutes() - cleaning_minute
        const seconds = date.getUTCSeconds()
        const milliseconds = date.getUTCMilliseconds()
        const calculateDiffHour = hour > 0 || (minutes >= 0 && hour === 0) ? 24 - hour : Math.abs(hour)

        const calculateMilliseconds =
            (calculateDiffHour * 60 * 60 * 1000) -
            (minutes * 60 * 1000) -
            (seconds * 1000) -
            milliseconds

        const hourlog = Math.floor((calculateMilliseconds / 3600000))
        const minuteslog = Math.ceil((calculateMilliseconds % 3600000) / 60000)

        console.log(`Starting expired token cleanup process in ${hourlog}H ${minuteslog}M`)

        setTimeout(async () => {
            const cleanCount = await UserTokensModel.deleteAllExpiredTokens()
            console.log(`${cleanCount} tokens were cleaned`)
            this.cleanExpiredTokens({ cleaning_hour, cleaning_minute })
        }, calculateMilliseconds)
    }

}


export default UserTokenService