import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"


const base = z.object({
    product_color_id: databaseKeySchema,
    color_fk: databaseKeySchema,
    product_fk: databaseKeySchema
})

const update = base.partial().extend({
    product_color_id: base.shape.product_color_id
})

const insert = base.omit({
    product_color_id : true
})



export declare namespace ProductColorSchema{
    type Base = z.infer<typeof base>
    type Update = z.infer<typeof update>
    type Insert = z.infer<typeof insert>
    type Delete = DatabaseKeySchema
}

const productColorSchema = {
    base,
    update,
    insert,
    delete : databaseKeySchema
}

export default productColorSchema