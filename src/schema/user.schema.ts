import { z } from "zod"
import databaseKeySchema, { DatabaseKeySchema } from "./databaseKey.schema"
import databaseBooleanSchema from "./databaseBoolean.schema"
import IPsRegExp from "../constant/IPsRegExp.constant"

const fullnamePattern = {
    regexp: /^[A-Za-z]+( [A-Za-z]+){1,}$/,
    message: "El nombre ingresado no es valido."
}

const passwordPatterns = [
    { regexp: /^(?=.*[A-Z])/, message: "Debe contener al menos una letra mayúscula" },
    { regexp: /(?=.*[\W_])/, message: "Debe contener al menos un carácter especial (o guion bajo)" },
    { regexp: /(?=.*\d)/, message: "Debe contener al menos un número" },
    { regexp: /^.{8,16}$/, message: "Debe tener entre 8 y 16 caracteres de longitud" }
]

const addRegexpInPasswor = (init = z.string()) => {
    passwordPatterns.forEach(({ regexp, message }) => (init = init.regex(regexp, message)))
    return init
}

const base = z.object({
    user_id: databaseKeySchema,
    fullname: z.string().regex(fullnamePattern.regexp, fullnamePattern.message),
    phone: z.string().nullable().optional().default(null), //FALTA MEJORAR ESTO
    email: z.string().email("El formato del email no es valido"),
    password: addRegexpInPasswor(),
    permission: z.enum(['admin', 'standard']).optional().default("standard"),
    ip: z.string().refine(value => Object.values(IPsRegExp).some(i => i.test(value)), { message: "No es una IP valida.", path: ["ip"] }),
    email_confirmed: databaseBooleanSchema.optional().default(false),
    create_at: z.string().optional(),
})

const insert = base.omit({
    user_id: true,
    create_at: true,
    email_confirmed: true,
}).extend({
    permission: z.literal("standard").default("standard")
})


const update = base.partial().extend({
    user_id: base.shape.user_id,
}).omit({
    ip: true,
    permission: true,
    create_at: true
})

const formatUser = base.omit({
    create_at: true,
    password: true
}).required()

declare namespace UserSchema {
    type Base = z.infer<typeof base>
    type Insert = z.infer<typeof insert>
    type Update = z.infer<typeof update>
    type Delete = DatabaseKeySchema
    type FormatUser = z.infer<typeof formatUser>
}

const userSchema = {
    base,
    insert,
    update,
    delete: databaseKeySchema,
    formatUser
}

export {
    type UserSchema
}

export default userSchema