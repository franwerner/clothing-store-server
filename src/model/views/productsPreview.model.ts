import { SortProducts } from "clothing-store-shared/types";
import sql from "@/config/knex.config.js";
import { PaginationProperties, FilterProperties, SortProperties } from "@/service/products/productsPreview.service.js";
import ModelUtils from "@/utils/model.utils.js";

const sortDatabase: Record<SortProducts, string> = {
    name: "p.product",
    price: "p.price",
    offers: "p.discount",
    newest: "p.create_at"
}

class ProductPreviewModel extends ModelUtils {
    static async select({
        filters,
        order,
        pagination
    }: {
        filters: FilterProperties
        order: SortProperties
        pagination: PaginationProperties
    }) {
        try {
            const { color, price, search, size, brand, category } = filters
            const { offset } = pagination
            const { sortDirection, sortField } = order

            const getSortDatabase = sortDatabase[sortField]
            const [min, max] = price || []
            const query = sql('brands as pb')
                .select(
                    'p.product',
                    'p.discount',
                    'p.price',
                    'ct.category',
                    'pb.brand',
                    "c.color",
                    "pc.product_color_id", //Funciona como indentificador unico.
                    "p.product_id"
                )
                .innerJoin('categories as ct', 'ct.brand_fk', 'pb.brand_id')
                .innerJoin('products as p', 'p.category_fk', 'ct.category_id')
                .innerJoin('product_colors as pc', 'pc.product_fk', 'p.product_id')
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .limit(15)
                .where("p.status", true)

            !size && query.whereExists(
                sql('product_color_sizes as pcs')
                    .select(1)
                    .whereRaw("pcs.product_color_fk = pc.product_color_id")
            )

            offset && query.offset(offset)
            getSortDatabase && query.orderBy(getSortDatabase, sortDirection)
            brand && query.where("pb.brand", brand)
            category && query.where("ct.category", category)
            search && query.whereILike("p.product", `%${search}%`)
            min && query.where("p.price", ">=", min)
            max && query.where("p.price", "<=", max)
            color && query.whereIn("c.color_id", color)
            size && query.whereIn("pc.product_color_id", (builder) => {
                builder.select("product_color_fk")
                    .from("product_color_sizes")
                    .whereIn("size_fk", size)
            })

            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    private static selectDetailBase(filters: Omit<FilterProperties, "size" | "color">) {
        /**
         * Se debe incluir esta base tanto para la seleccion de colores y tamaños,
         * debido a que se necesitar hacer los mismos filtros de los productos, para obtener los colores y tamaños relacionados correctamente.
         */

        const { price, brand, category, search } = filters
        const [min, max] = price || []
        const query =
            sql("brands as b")
                .count("* as quantity")
                .innerJoin("categories as ct", "ct.brand_fk", "b.brand_id")
                .innerJoin("products as p", "p.category_fk", "ct.category_id")
                .innerJoin("product_colors as pc", "p.product_id", "pc.product_fk")
                .where("p.status", true)
        min && query.where("p.price", ">=", min)
        max && query.where("p.price", "<=", max)
        brand && query.where("b.brand", brand)
        category && query.where("ct.category", category)
        search && query.whereILike("p.product", `%${search}%`)
        return query

    }
    static async selectProductColors({ size, ...filters }: Omit<FilterProperties, "color">) {
        try {
            const query = this.selectDetailBase(filters)
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .select("c.color_id", "c.color", "c.hexadecimal")
                .groupBy("c.color_id")
            !size && query.whereExists(
                sql('product_color_sizes as pcs')
                    .select(1)
                    .whereRaw("pcs.product_color_fk = pc.product_color_id")
            )//Solo queremos obtener los colores que contengan tamaños relacionados.

            size && query.whereIn("pc.product_color_id", (builder) => {
                builder.select("product_color_fk")
                    .from("product_color_sizes")
                    .whereIn("size_fk", size)
            })
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectProductSizes({ color, ...filters }: Omit<FilterProperties, "size">) {
        try {
            const query = this.selectDetailBase(filters)
                .select("s.size_id", "s.size")
                .groupBy("s.size_id")
                .innerJoin("product_color_sizes as pcs", "pc.product_color_id", "pcs.product_color_fk")
                .innerJoin("sizes as s", "s.size_id", "pcs.size_fk")
            color && query.whereIn("pc.color_fk", color)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default ProductPreviewModel