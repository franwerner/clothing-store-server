import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"
import databaseBooleanSchema from "./databaseBoolean.schema.js"

const base = z.object({
    product_color_size_id: databaseKeySchema,
    product_color_fk: databaseKeySchema,
    size_fk: databaseKeySchema,
    stock: databaseBooleanSchema.default(true).optional(),
    status : databaseBooleanSchema.default(true).optional()
})

const update = base.partial().extend({
    product_color_size_id: base.shape.product_color_size_id
})

const insert = base.omit({ product_color_size_id: true })

declare namespace ProductColorSizeSchema {
    type Base = z.infer<typeof base>
    type Update = z.infer<typeof update>
    type Insert = z.infer<typeof insert>
    type Delete = DatabaseKeySchema
}

const productColorSizeSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type ProductColorSizeSchema
}

export default productColorSizeSchema