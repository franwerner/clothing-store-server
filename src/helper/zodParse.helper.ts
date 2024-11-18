import { ZodSchema } from "zod"
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js"

/**
 * Ejecutamos de forma segura el parse y personalizamos el error con uno custom para sea mas facil manejarlo en el contexto manejo de error de la APP
 */

const zodParse = <T extends ZodSchema>(z: T) => {
    return (data:unknown):ReturnType<T['parse']> => {
        try {
            return z.parse(data)
        } catch (error) {
            if (ZodErrorHandler.isZodError(error)) {
                throw new ZodErrorHandler(error)
            }
            throw error
        }
    }
}


export default zodParse