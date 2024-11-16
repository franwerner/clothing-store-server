import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface Color {
    color_id: KEYDB,
    color: string,
    hexadecimal: `#${string}`
}

type ColorKeys = keyof Color
type ColorPartial = Partial<Color>
type ColorRequerid = Required<Color>
type ColorInsert = Omit<Color, "color_id">
type ColorUpdate = ColorPartial & { color_id: KEYDB }
class ColorsModel extends ModelUtils {
    static async select<T extends ColorKeys = ColorKeys>(props: ColorPartial = {}, modify?: ModifySQL<Pick<ColorRequerid, T>>) {
        try {
            const query = sql<Pick<ColorRequerid, T>>("colors")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(color: Array<ColorInsert> | ColorInsert) {
        try {
            return await sql("colors")
                .insert(color)
        } catch (error) {
            throw this.generateError(error)

        }
    }

    static async update({ color_id, ...color }: ColorUpdate) {
        try {
            return await sql("colors")
                .update(color)
                .where("color_id", color_id)
        } catch (error) {
            this.generateError(error)
        }
    }

    static async delete(colorsIDs: Array<KEYDB>) {
        try {
            return await sql("colors")
                .whereIn("color_id", colorsIDs)
                .delete()
        } catch (error) {
            this.generateError(error)
        }
    }
}

export {
    type Color
}
export default ColorsModel


