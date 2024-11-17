import ProductsModel from "../model/products.model.js"
import productSchema, { ProductSchema } from "../schema/product.schema.js"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ProductsService extends ServiceUtils {

    static async get() {
        const products = await ProductsModel.select()

        if (products.length === 0) throw new ErrorHandler({
            message: "No se encontraron productos",
            status: 404
        })

        return products
    }

    static async update(products: Array<ProductSchema.Update>) {
        const data = productSchema.update.array().parse(products)
        return await this.writeOperationsHandler(data, (e) => ProductsModel.update(e))
    }

    static async insert(products: Array<ProductSchema.Insert>) {
        const data = productSchema.insert.array().parse(products)
        return await this.writeOperationsHandler(data, (e) => ProductsModel.insert(e))
    }

    static async delete(products: Array<ProductSchema.Delete>) {
        const data = productSchema.delete.array().parse(products)
        return await this.writeOperationsHandler(data, (e) => ProductsModel.delete(e))
    }
}


export default ProductsService