import sql from "../database/index.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"
import { ProductPreviewFilters } from "../utils/generateProductPreviewFilters.js"

class ProductsPreviewModel {

    static async selectProduct(querys: ProductPreviewFilters) {

        const { color, price, search, size, brand, category } = querys
        try {
            const subQueryForOneImagePerProductColor = sql('product_color_images as pci')
                .select(
                    'pci.*',
                    sql.raw('ROW_NUMBER() OVER (PARTITION BY pci.product_color_fk) AS row_num')
                );

            const query = sql('product_brands as pb')
                .select(
                    'p.product_id',
                    'p.product',
                    'p.discount',
                    'p.price',
                    'pt.category',
                    'pb.brand',
                    'pc.color',
                    'pci.url',
                    "pc.product_color_id" //Quitar cuando se termine de depurar el codigo
                )
                .innerJoin('product_categories as pt', 'pt.product_brand_fk', 'pb.product_brand_id')
                .innerJoin('products as p', 'p.product_category_fk', 'pt.product_category_id')
                .innerJoin('product_colors as pc', 'pc.product_fk', 'p.product_id')
                .leftJoin(subQueryForOneImagePerProductColor.as("pci"), (pci) => {
                    pci.on('pci.product_color_fk', '=', 'pc.product_color_id')
                    pci.andOn('pci.row_num', '=', (1 as any))
                })
                .where("p.status", "=",true)
                .whereExists(
                    sql("product_color_sizes")
                    .select(1)
                    .whereRaw('product_color_fk = pc.product_color_id')
                    .limit(1)
                )

            brand && query.where("pb.brand", brand)
            category && query.where("pt.category", category)
            search && query.whereRaw("p.product LIKE ?", [`%${search}%`]);
            price && query.whereBetween("p.price", price)
            color && query.whereIn("pc.color", color)
            size && query.whereIn("pc.product_color_id",
                sql("product_color_sizes")
                    .select("product_color_fk")
                    .whereIn("size", size)
            )
            const res = await query
            return res
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            }
        }
    }

}


export default ProductsPreviewModel