import { ColorSchema } from "clothing-store-shared/schema"
import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

type ColorPartial = Partial<ColorSchema.Base>
class ColorsModel extends ModelUtils {
    static async select(props: ColorPartial = {}, modify?: APP.ModifySQL) {
        try {
            const query = sql("colors")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(color: ColorSchema.Insert) {
        try {
            return await sql("colors")
                .insert(color)
        } catch (error) {
            throw this.generateError(error, {
                ER_DUP_ENTRY: "El color que intentas registrar ya existe en la base de datos."
            })

        }
    }

    static async update({ color_id, ...color }:  ColorSchema.Update) {
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
