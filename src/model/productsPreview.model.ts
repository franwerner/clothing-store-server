import sql from "../config/knex.config.js"
import { ProductPreviewFilters } from "../service/productsPreview.service.js";
import ModelUtils from "../utils/model.utils.js";

const productsPreviewModel = async (querys: ProductPreviewFilters) => {

    try {
        const { color, price, search, size, brand_id, category_id } = querys

        const subQueryForOneImagePerProductColor = sql('product_color_images as pci')
            .select(
                'pci.*',
                sql.raw('ROW_NUMBER() OVER (PARTITION BY pci.product_color_fk) AS row_num')
            );

        const query = sql('brands as pb')
            .select(
                'p.product_id',
                'p.product',
                'p.discount',
                'p.price',
                'pt.category',
                'pb.brand',
                'pci.url',
                "c.color",
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
            .where("pb.status", true)
            .where("pt.status", true)

        !size && query.whereExists(
            sql("product_color_sizes")
                .whereRaw('product_color_fk = pc.product_color_id')
        )

        brand_id && query.where("pb.brand_id", brand_id)
        category_id && query.where("pt.category_id", category_id)
        search && query.whereRaw("p.product LIKE ?", [`%${search}%`]);
        price && query.whereBetween("p.price", price)
        color && query.whereIn("c.color_id", color)
        size && query.whereIn("pc.product_color_id",
            sql("product_color_sizes")
                .select("product_color_fk")
                .whereIn("size_fk", size)
        )

        return await query
    } catch (error) {
        throw ModelUtils.generateError(error)
    }

}



export default productsPreviewModel