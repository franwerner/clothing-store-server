import { z } from "zod";
import databaseKeySchema from "./databaseKey.schema";


const base = z.object({
    user_purchase_id: databaseKeySchema,
    operation_id: databaseKeySchema.nullable().default(null).optional(),
    user_fk: databaseKeySchema,
    status: z.enum(["canceled", "pending", "completed"]).default("pending").optional(),
    note: z.string().nullable().default(null).optional()
})

const insert = base.omit({ user_purchase_id: true })

const update = z.object({
    operation_id: databaseKeySchema,
    user_purchase_id : databaseKeySchema
})


declare namespace UserPurchaseSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
}

const userPurchaseSchema = {
    base,
    insert,
    update
}

export {
    type UserPurchaseSchema
}

export default userPurchaseSchema