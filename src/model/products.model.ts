import sql from "../database/index.js"
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js"

interface Product {
    product_id: number
    product_category_fk: number,
    product: string,
    discount: number,
    price: number,
    status: boolean
}


class ProductsModel {

    static async insertProduct({ discount = 0, price, product, product_category_fk, status = true }: Product, connection = sql) {

        try {
            return await connection("products")
                .insert({
                    "product_category_fk": product_category_fk,
                    "product": product,
                    "discount": discount,
                    "price": price,
                    "status": status
                })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

    static async updateProduct({ product_id, ...props }: Product, connection = sql) {
        try {
            return await connection("products")
                .update(props)
                .where("product_id", "=", product_id)
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

    static async selectProduct({ product_id,product_category_fk,permission }: { product_id?: string, product_category_fk?: string, permission: string }) {
        try {
            const r = sql("products")
                product_id && r.where("product_id", product_id)
                product_category_fk  && r.where("product_category_fk",product_category_fk)
            return await r
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                throw new ErrorHandlerDataBase(error.code)
            } else {
                throw error
            }
        }
    }

}

export {
    type Product
}
export default ProductsModel