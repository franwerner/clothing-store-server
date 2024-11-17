import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKeySchema.schema.js"

const base = z.object({
    category_id: databaseKeySchema,
    category: z.string(),
    brand_fk: databaseKeySchema,
    status: z.boolean().optional()
})


const update = base.partial().extend({
    category_id: base.shape.category_id
})

const insert = base.omit({ category_id: true })


declare namespace CategorySchema {
    type Base = z.infer<typeof base>
    type Update = z.infer<typeof update>
    type Insert = z.infer<typeof insert>
    type Delete = DatabaseKeySchema
}

const categorySchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type CategorySchema
}

export default categorySchema