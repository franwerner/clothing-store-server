
import { DatabaseKeySchema, ShopcartProductSchema } from "clothing-store-shared/schema";
import sql from "../config/knex.config";
import ModelUtils from "../utils/model.utils";

interface ProductDetails {
    product: string
    discount: number
    price: number
    color: string
    size: string
    url: string
    product_color_id: DatabaseKeySchema
    id: DatabaseKeySchema
}

class ShopcartModel extends ModelUtils {

    static async selectDetailsProducts({ color_fk, product_fk, size_fk }: Omit<ShopcartProductSchema.BaseOutShopcart, "quantity">): Promise<ProductDetails[]> {
        try {
            const query = await sql('products as p')
                .select(
                    'p.product',
                    'p.discount',
                    'p.price',
                    'c.color',
                    's.size',
                    'pc.product_color_id',
                    "pcs.product_color_size_id as id"
                )
                .innerJoin('product_colors as pc', 'pc.product_fk', 'p.product_id')
                .innerJoin('product_color_sizes as pcs', 'pcs.product_color_fk', 'pc.product_color_id')
                .innerJoin('colors as c', 'c.color_id', 'pc.color_fk')
                .innerJoin('sizes as s', 's.size_id', 'pcs.size_fk')
                .where({
                    'p.product_id': product_fk,
                    'pc.color_fk': color_fk,
                    'pcs.size_fk': size_fk,
                    'p.status': true,
                    'pcs.stock': true
                })


            return query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}


export default ShopcartModel