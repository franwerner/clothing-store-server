import { UserTokenSchema } from "clothing-store-shared/schema";
import { CreateToken } from "../service/userToken.service";

const tokenSettings: Record<UserTokenSchema.RequestToken, Readonly<CreateToken>> = {
    email_confirm: { maxTokens: 20, timeUnit: "day", timeValue: 1 }, //1 DIA
    // email_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }, // 1 HORAS
    password_reset_by_email: { maxTokens: 20, timeUnit: "hour", timeValue: 3 } // 3 HORAS
};

export default tokenSettings