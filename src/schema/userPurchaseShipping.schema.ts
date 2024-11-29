import { z } from "zod";
import databaseBooleanSchema from "./databaseBoolean.schema";
import databaseKeySchema from "./databaseKey.schema";

const base = z.object({
    user_purchase_shipping_id: databaseKeySchema,
    cost: z.number(),
    isFree: databaseBooleanSchema,
    tracking_id: databaseKeySchema,
    state: z.enum(["canceled", "pending", "completed"]).default("pending").optional(),
    user_purchase_fk: databaseKeySchema
})

const insert = base.omit({
    user_purchase_shipping_id: true,
    state: true
})

const update = base.pick({
    user_purchase_shipping_id: true,
    state: true,
})

export declare namespace UserPurchaseShippingSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
}

const userPurchaseShippingSchema = {
    base,
    update,
    insert
}

export default userPurchaseShippingSchema