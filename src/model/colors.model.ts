import sql from "../database/index.js"
import ModelUtils from "../utils/model.utils.js"

interface Color {
    color_id: KEYDB,
    color: string,
    hexadecimal: `#${string}`
}

type SelectProps = Partial<Color>
class ColorsModel extends ModelUtils {
    static select(props: SelectProps = {}) {
        return sql("colors")
            .where(this.removePropertiesUndefined(props))
    }

    static insert(color: Array<Color> | Color) {
        return sql("colors")
            .insert(color)
    }

    static update({ color_id, ...color }: Color) {
        return sql("colors")
            .update(color)
            .where("color_id", color_id)
    }

    static delete(colorsIDs: Array<KEYDB>) {
        return sql("colors")
            .whereIn("color_id", colorsIDs)
            .delete()
    }
}

export {
    type Color
}
export default ColorsModel