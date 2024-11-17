import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKeySchema.schema.js"

const base = z.object({
    product_color_image_id: databaseKeySchema,
    product_color_fk: databaseKeySchema,
    url: z.string()
})


const update = base.partial().extend({
    product_color_image_id : base.shape.product_color_image_id
})

const insert = base.omit({ product_color_image_id: true })

declare namespace ProductColorImageSchema {
    type Base = z.infer<typeof base>
    type Update = z.infer<typeof update>
    type Insert = z.infer<typeof insert>
    type Delete = DatabaseKeySchema
}

const productColorImageSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type ProductColorImageSchema
}

export default productColorImageSchema