import sql from "../config/knex.config.js"
import { ColorSchema } from "../schema/color.schema.js"
import Exact from "../types/Exact.types.js"
import ModelUtils from "../utils/model.utils.js"


type ColorKeys = keyof ColorSchema.Base
type ColorPartial = Partial<ColorSchema.Base>
type ColorRequerid = Required<ColorSchema.Base>
class ColorsModel extends ModelUtils {
    static async select<T extends ColorKeys = ColorKeys>(props: ColorPartial = {}, modify?: APP.ModifySQL<Pick<ColorRequerid, T>>) {
        try {
            const query = sql<Pick<ColorRequerid, T>>("colors")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert<T extends ColorSchema.Insert>(color: Exact<T, ColorSchema.Insert>) {
        try {
            return await sql("colors")
                .insert(color)
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "El color que intentas registrar ya existe en la base de datos."
            })

        }
    }

    static async update<T extends ColorSchema.Update>({ color_id, ...color }: Exact<T, ColorSchema.Update>) {
        try {
            return await sql("colors")
                .update(color)
                .where("color_id", color_id)
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "El nombre del color que intentas actualizar ya se existe en la base de datos."
            })
        }
    }

    static async delete(colorsID: ColorSchema.Delete) {
        try {
            return await sql("colors")
                .where("color_id", colorsID)
                .delete()
        } catch (error) {
            throw this.generateError(error, {
                ER_ROW_IS_REFERENCED_2: "No se puede eliminar el color porque esta asociado a la lista de compras de usuarios."
            })
        }
    }
}

export default ColorsModel


