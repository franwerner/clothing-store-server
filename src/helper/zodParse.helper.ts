import { ZodSchema } from "zod"
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js"

/**
 * Realiza el parseo seguro de datos usando un esquema Zod.
 * En caso de que ocurra un error de validación, se lanza un error personalizado 
 * para facilitar su manejo en el contexto de la aplicación.
 * 
 * @example 
 * const parseData = zodParse(brandSchema.update)
 * parseData(values)
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