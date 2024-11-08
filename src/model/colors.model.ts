import sql from "../database/index.js"

interface Color {
    color_id: number,
    color: string,
    hexadecimal: `#${string}`
}

class ColorsModel {
    static select() {
        return sql("colors")
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

    static delete(colorsIDs:Array<number>){
        return sql("colors")
        .whereIn("color_id",colorsIDs)
        .delete()
    }
}

export {
    type Color
}
export default ColorsModel