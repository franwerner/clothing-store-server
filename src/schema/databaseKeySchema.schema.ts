import { z } from "zod";

const databaseKeySchema = z.union([z.number(), z.string().regex(/^\d+$/,"El tipo de la clave no es valido.")])

export type DatabaseKeySchema = z.infer<typeof databaseKeySchema>
export default databaseKeySchema