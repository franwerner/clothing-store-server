import sql from "../database/index.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

interface ProductBrand {
    product_brand_id: number,
    brand: string
    status: boolean
}


class ProductBrandsModel {

    static async selectBrand({ product_brand_id }: { product_brand_id?: string } = {}) {
        try {
            const query = sql("product_brands")
                .select("brand")
            if (product_brand_id) query.where("product_brand_id", product_brand_id)
            return await query
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }
    static async insertBrand(props: ProductBrand) {
        try {
            return sql("product_brands")
                .insert(props)
        } catch (error) {
            console.log(error)
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }


}

export {
    type ProductBrand
}
export default ProductBrandsModel