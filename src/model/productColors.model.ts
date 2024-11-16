import sql from "../config/knex.config.js"
import ModelUtils from "../utils/model.utils.js"

interface ProductColor {
    product_color_id: KEYDB
    color_fk: KEYDB
    product_fk: KEYDB
}

type ProductColorKeys = keyof ProductColor
type ProductColorPartial = Partial<ProductColor>
type ProductColorRequerid = Required<ProductColor>
type ProductColorInsert = Omit<ProductColor, "product_color_id">
type ProductColorUpdate = ProductColorPartial & { product_color_id: KEYDB }
class ProductColorsModel extends ModelUtils {
    static async select<T extends ProductColorKeys = ProductColorKeys>(
        props: ProductColorPartial = {},
        modify?: ModifySQL<Pick<ProductColorRequerid, T>>
    ) {
        try {
            const query = sql<Pick<ProductColorRequerid, T>>("product_colors as pc")
                .where(this.removePropertiesUndefined(props))
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(productColor: Array<ProductColorInsert> | ProductColorInsert) {
        try {
            return await sql("product_colors")
                .insert(productColor)
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update({ product_color_id, ...productColor }: ProductColorUpdate) {
        try {
            return await sql("product_colors")
                .update(productColor)
                .where("product_color_id", product_color_id)
        } catch (error) {
            this.generateError(error)
        }
    }

    static async delete(productColorIDs: Array<KEYDB>) {
        try {
            return await sql("product_colors")
                .whereIn("product_color_id", productColorIDs)
                .delete()
        } catch (error) {
            this.generateError(error)
        }
    }

    static selectWithTableColor<T extends ProductColorKeys = ProductColorKeys>(
        props?: ProductColorPartial ,
        modify?: ModifySQL<Pick<ProductColorRequerid, T>>) {
        return this.select<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder
                .leftJoin("colors as c", "c.color_id", "pc.color_fk")
        })
    }

    static selectExistsSizes<T extends ProductColorKeys = ProductColorKeys>(
        props?: ProductColorPartial,
        modify?: ModifySQL<Pick<ProductColorRequerid, T>>
    ) {
        return this.selectWithTableColor<T>(props, (builder) => {
            modify && builder.modify(modify)
            builder
                .whereExists(
                    sql("product_color_sizes")
                        .whereRaw("product_color_fk = pc.product_color_id")
                )
        })
    }
}


export {
    type ProductColor
}
export default ProductColorsModel