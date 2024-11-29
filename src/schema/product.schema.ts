import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"
import databaseBooleanSchema from "./databaseBoolean.schema.js"


const base = z.object({
  product_id: databaseKeySchema,
  category_fk: databaseKeySchema,
  product: z.string(),
  discount: z.number().min(0).max(100).default(0).optional(),
  price: z.number(),
  status: databaseBooleanSchema.default(true).optional()
})

const insert = base.omit({
  product_id: true
})

const update = base.partial().extend({
  product_id: base.shape.product_id
})

const updateByCategory = z.object({
  category_fk: base.shape.category_fk,
  discount: base.shape.discount,
  status : base.shape.status
})

declare namespace ProductSchema {
  type Base = z.infer<typeof base>
  type Insert = z.infer<typeof insert>
  type Update = z.infer<typeof update>
  type Delete = DatabaseKeySchema
  type UpdateByCategory = z.infer<typeof updateByCategory>
}

const productSchema = {
  base,
  update,
  insert,
  delete: databaseKeySchema,
  updateByCategory
}

export {
  type ProductSchema
}

export default productSchema