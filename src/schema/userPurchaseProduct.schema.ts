import { z } from "zod";
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema";

const base = z.object({
    user_purchase_product_id: databaseKeySchema,
    discount: z.number().min(0).max(100).default(0).optional(),
    quantity: z.number().min(1).int(),
    price: z.number(),
    product_fk: databaseKeySchema,
    user_purchase_fk: databaseKeySchema,
    color_fk: databaseKeySchema,
    size_fk: databaseKeySchema,
})

const insert = base.omit({
    user_purchase_product_id: true,
    price: true,
    discount: true,
})

declare namespace UserPurchaseProductSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
}

export type {
    UserPurchaseProductSchema
}

const userPurchaseProductSchema = {
    base,
    insert,
}
export default userPurchaseProductSchema