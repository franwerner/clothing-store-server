import { z } from "zod";
import databaseKeySchema from "./databaseKey.schema";


const base = z.object({
    user_purchase_id: databaseKeySchema,
    user_fk: databaseKeySchema,
    state: z.enum(["canceled", "pending", "completed"]).default("pending").optional(),
    note: z.string().nullable().default(null).optional(),
    preference_id : z.string(),
    expire_at : z.string()
})

const insert = base.omit({ 
    user_purchase_id: true,
    preference_id : true,
    state : true
 })


const update = base.pick({
    state : true,
    preference_id : true
}).partial().extend({
    user_purchase_id : base.shape.user_purchase_id
})

const updateForUser = update.extend({
    user_fk : base.shape.user_fk
})


declare namespace UserPurchaseSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type UpdateForUser = z.infer<typeof updateForUser>
}

const userPurchaseSchema = {
    base,
    insert,
    update,
    updateForUser
}

export {
    type UserPurchaseSchema
}

export default userPurchaseSchema