import z from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKeySchema.schema.js"


const base = z.object({
    brand_id: databaseKeySchema,
    brand: z.string(),
    status: z.boolean().optional()
})


const insert = base.omit({
    brand_id: true
})

const update = base.partial().extend({
    brand_id: base.shape.brand_id
})


declare namespace BrandSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
}


const brandSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type BrandSchema
}
export default brandSchema