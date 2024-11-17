import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKeySchema.schema.js"

const base = z.object({
    user_id: databaseKeySchema,
    fullname: z.string(),
    phone: z.string().nullable().optional(),
    email: z.string().email(),
    password: z.string(),
    permission: z.enum(['admin', 'standard']).optional(),
    ip: z.string(),
    email_confirmed: z.boolean().optional(),
    create_at: z.string().optional(),
})

const insert = base.omit({
    user_id: true,
    create_at: true,
    email_confirmed : true
})

const update = base.partial().extend({
    user_id: base.shape.user_id,
})

declare namespace UserSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
}

const userSchema = {
    base,
    insert,
    update,
    delete: databaseKeySchema,
}

export {
    type UserSchema
}

export default userSchema