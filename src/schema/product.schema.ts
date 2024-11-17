import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKeySchema.schema.js"


const base = z.object({
    product_id: databaseKeySchema,
    category_fk: databaseKeySchema,
    product: z.string(),
    discount: z.number().optional(),
    price: z.number(),
    status: z.boolean().optional()
  })
  
  const insert = base.omit({
    product_id: true
  })
  
  const update = base.partial().extend({
    product_id: base.shape.product_id
  })
  
  declare namespace ProductSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
  }
  
  const productSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
  }
  
  export {
    type ProductSchema
  }
  
  export default productSchema