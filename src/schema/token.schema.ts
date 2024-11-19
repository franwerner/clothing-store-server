import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"
import databaseBooleanSchema from "./databaseBoolean.schema.js"

const requestTokenSchema = z.enum(["email_confirm", "password_reset_by_email"])

const base = z.object({
    user_token_id: databaseKeySchema,
    user_fk: databaseKeySchema,
    request: requestTokenSchema,
    token: z.string(),
    ip: z.string(),
    expired_at: z.string(),
    used: databaseBooleanSchema.optional().default(false),
    created_at: z.string().optional()
})

const insert = base.omit({
    user_token_id: true,
    created_at: true,
    used: true
})

const update = base.pick({ token: true, used: true })


declare namespace UserTokenSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
    type RequestToken = z.infer<typeof requestTokenSchema>
}

const userTokenSchema = {
    base,
    insert,
    update,
    delete: databaseKeySchema,
    requestTokenSchema
}

export {
    type UserTokenSchema,
}

export default userTokenSchema
