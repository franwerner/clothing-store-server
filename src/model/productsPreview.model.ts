import { OrderProducts } from "clothing-store-shared/types";
import sql from "../config/knex.config.js";
import { ProductPreviewFilters, ProductPreviewOrder, ProductPreviewPagination } from "../service/productsPreview.service.js";
import ModelUtils from "../utils/model.utils.js";

const getOrderProduct = (orderKey: OrderProducts) => {
    if (orderKey === "name") {
        return "p.product"
    } else if (orderKey === "price") {
        return "p.price"
    } else if (orderKey === "offers") {
        return "p.discount"
    } else if (orderKey === "newest") {
        return "p.create_at"
    }
}


class ProductPreviewModel extends ModelUtils {
    static async selectProducts({
        filters,
        order,
        pagination
    }: {
        filters: ProductPreviewFilters
        order: ProductPreviewOrder
        pagination: ProductPreviewPagination
    }) {
        try {
            const { color, price, search, size, brand, category } = filters
            const { offset } = pagination
            const orderField = getOrderProduct(order.sortField)
            const defaultOrder = ["asc", "desc"].includes(order.sortDirection) ? order.sortDirection : "asc"
            const [min, max] = price || []
            const subQueryForOneImagePerProductColor = sql('product_color_images as pci')
                .select(
                    'pci.*',
                    sql.raw('ROW_NUMBER() OVER (PARTITION BY pci.product_color_fk) AS row_num')
                );
            const query = sql('brands as pb')
                .select(
                    'p.product',
                    'p.discount',
                    'p.price',
                    'ct.category',
                    'pb.brand',
                    'pci.url',
                    "c.color",
                    "pc.product_color_id",
                    "p.product_id"
                )
                .innerJoin('categories as ct', 'ct.brand_fk', 'pb.brand_id')
                .innerJoin('products as p', 'p.category_fk', 'ct.category_id')
                .innerJoin('product_colors as pc', 'pc.product_fk', 'p.product_id')
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .leftJoin(subQueryForOneImagePerProductColor.as("pci"), (pci) => {
                    pci.on('pci.product_color_fk', '=', 'pc.product_color_id')
                    pci.andOn('pci.row_num', '=', (1 as any))
                })
                .limit(15)
                .where("p.status", true)
                .whereExists(
                    sql('product_color_sizes as pcs')
                        .select(1)
                        .whereRaw("pcs.product_color_fk = pc.product_color_id")
                )
            offset && query.offset(Number(offset))
            orderField && query.orderBy(orderField, defaultOrder)
            brand && query.where("pb.brand", brand)
            category && query.where("ct.category", category)
            search && query.whereILike("p.product", `%${search}%`);
            min && query.where("p.price", ">=", min)
            max && query.where("p.price", "<=", max)
            color && query.whereIn("c.color_id", color)
            size && query.whereIn("pc.product_color_id",
                sql("product_color_sizes")
                    .select("product_color_fk")
                    .whereIn("size_fk", size)
            )
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    private static selectProductsPreviewDetailBase(filters: Omit<ProductPreviewFilters, "size" | "color">) {

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
        search && query.whereILike("p.product", `%${search}%`);
        return query

    }

    static async selectProductColors({ size, ...filters }: Omit<ProductPreviewFilters, "color">) {
        try {
            const query = this.selectProductsPreviewDetailBase(filters)
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .select("c.color_id", "c.color", "c.hexadecimal")
                .groupBy("c.color_id")
                .whereExists(
                    sql('product_color_sizes as pcs')
                        .select(1)
                        .whereRaw("pcs.product_color_fk = pc.product_color_id")
                )
            size && size.length > 0 && query.whereIn("pc.product_color_id", (builder) => {
                builder.select("product_color_fk")
                    .from("product_color_sizes")
                    .whereIn("size_fk", size)
            })
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async selectProductSizes({ color, ...filters }: Omit<ProductPreviewFilters, "size">) {
        try {
            const query = this.selectProductsPreviewDetailBase(filters)
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