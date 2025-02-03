import { UserTokenSchema } from "clothing-store-shared/schema";

export interface TokenSettings  {
        timeUnit: "minutes" | "hours" | "days",
        timeValue: number,
        maxTokens: number
}

const tokenSettings: Record<UserTokenSchema.RequestToken, Readonly<TokenSettings>> = {
    email_confirm: { maxTokens: 20, timeUnit: "days", timeValue: 1 }, //1 DIA
    // email_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }, // 1 HORAS
    password_reset_by_email: { maxTokens: 20, timeUnit: "hours", timeValue: 3 } // 3 HORAS
};

export default tokenSettings