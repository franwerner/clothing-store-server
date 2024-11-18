import { UserTokenSchema } from "../schema/token.schema";
import { CreateToken } from "../service/userToken.service";

const tokenSettings: Record<UserTokenSchema.RequestToken, Readonly<CreateToken>> = {
    register_confirm: { maxTokens: 10, timeUnit: "day", timeValue: 1 },
    email_update: { maxTokens: 10, timeUnit: "day", timeValue: 1 },
    password_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }
};




export default tokenSettings