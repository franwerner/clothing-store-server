import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema.js"


const hexadecimalPattern = {
    regexp: /#([A-Fa-f0-9]{6})/g,
    message: "No es un hexadecimal valido."
}

const base = z.object({
    color_id: databaseKeySchema,
    color: z.string(),
    hexadecimal: z.string().regex(hexadecimalPattern.regexp, hexadecimalPattern.message),
})

const update = base.partial().extend({
    color_id: base.shape.color_id
})
const insert = base.omit({ color_id: true })

declare namespace ColorSchema {
    type Base = z.infer<typeof base>
    type Update = z.infer<typeof update>
    type Insert = z.infer<typeof insert>
    type Delete = DatabaseKeySchema
}

const colorSchema = {
    base,
    update,
    insert,
    delete: databaseKeySchema
}

export {
    type ColorSchema
}

export default colorSchema