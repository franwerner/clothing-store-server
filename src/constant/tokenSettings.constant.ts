import { UserTokenSchema } from "../schema/token.schema";
import { CreateToken } from "../service/userToken.service";

const tokenSettings: Record<UserTokenSchema.RequestToken, Readonly<CreateToken>> = {
    email_confirm: { maxTokens: 10, timeUnit: "day", timeValue: 1 }, //1 DIA
    // email_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }, // 1 HORAS
    password_reset_by_email: { maxTokens: 10, timeUnit: "hour", timeValue: 3 } // 3 HORAS
};

export default tokenSettings