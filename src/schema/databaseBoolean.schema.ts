import { z } from "zod";

const databaseBooleanSchema = z.union([z.literal(0), z.literal(1),z.boolean()])

type DatabaseBooleanSchema = z.infer<typeof databaseBooleanSchema>
export {
    type DatabaseBooleanSchema
}
export default databaseBooleanSchema