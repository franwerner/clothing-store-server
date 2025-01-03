import { DatabaseKeySchema } from "clothing-store-shared/schema";
import sql from "../config/knex.config.js"
import { ProductPreviewFilters, ProductPreviewOrder } from "../service/productsPreview.service.js";
import ModelUtils from "../utils/model.utils.js";
import { OrderProducts } from "clothing-store-shared/types";

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
    static async getProducts(filters: ProductPreviewFilters, order: ProductPreviewOrder) {
        try {
            const { color, price, search, size, brand, category } = filters
            const orderField = getOrderProduct(order.orderKey)
            const defaultOrder = ["asc", "desc"].includes(order.order) ? order.order : "asc"
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
                    'pt.category',
                    'pb.brand',
                    'pci.url',
                    "c.color",
                    "pc.product_color_id",
                    "p.product_id"
                )
                .innerJoin('categories as pt', 'pt.brand_fk', 'pb.brand_id')
                .innerJoin('products as p', 'p.category_fk', 'pt.category_id')
                .innerJoin('product_colors as pc', 'pc.product_fk', 'p.product_id')
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .leftJoin(subQueryForOneImagePerProductColor.as("pci"), (pci) => {
                    pci.on('pci.product_color_fk', '=', 'pc.product_color_id')
                    pci.andOn('pci.row_num', '=', (1 as any))
                })
                .where("p.status", true)

            orderField && query.orderBy(orderField, defaultOrder)
            brand && query.where("pb.brand", brand)
            category && query.where("pt.category", category)
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

    static async getProductColors(productsIDs: Array<DatabaseKeySchema>, sizeIDs?: Array<DatabaseKeySchema>) {
        try {
            const query = sql("products as p")
                .select(
                    "c.color_id",
                    "c.color",
                    "c.hexadecimal"
                )
                .count("* as quantity")
                .innerJoin("product_colors as pc", "p.product_id", "pc.product_fk")
                .innerJoin("colors as c", "c.color_id", "pc.color_fk")
                .groupBy("c.color_id")
            productsIDs && productsIDs.length > 0 && query.whereIn("p.product_id", productsIDs)
            sizeIDs && sizeIDs.length > 0 && query.whereIn("pc.product_color_id", function () {
                this.select("product_color_fk")
                    .from("product_color_sizes")
                    .whereIn("size_fk", sizeIDs)
            })
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async getProductSizes(productsIDs: Array<DatabaseKeySchema>, colorIDs?: Array<DatabaseKeySchema>) {
        try {
            const query = sql("products as p")
                .select(
                    "s.size_id",
                    "s.size"
                )
                .count("* as quantity")
                .innerJoin("product_colors as pc", "p.product_id", "pc.product_fk")
                .innerJoin("product_color_sizes as pcs", "pc.product_color_id", "pcs.product_color_fk")
                .innerJoin("sizes as s", "s.size_id", "pcs.size_fk")
                .groupBy("s.size")
            productsIDs && productsIDs.length > 0 && query.whereIn("p.product_id", productsIDs)
            colorIDs && colorIDs.length > 0 && query.whereIn("pc.color_fk", colorIDs)

            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default ProductPreviewModel