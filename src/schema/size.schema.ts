import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"

const base = z.object({
    size_id: databaseKeySchema,
    size: z.string()
})

const insert = base.omit({
    size_id: true
})

const update = base.partial().extend({
    size_id: base.shape.size_id
})

declare namespace SizeSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
}

const sizeSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type SizeSchema
}

export default sizeSchema