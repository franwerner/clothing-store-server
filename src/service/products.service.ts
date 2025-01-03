import zodParse from "../helper/zodParse.helper.js"
import ProductsModel from "../model/products.model.js"
import { DatabaseKeySchema, ProductSchema,productSchema } from "clothing-store-shared/schema"
import ErrorHandler from "../utils/errorHandler.utilts.js"
import ServiceUtils from "../utils/service.utils.js"

class ProductsService extends ServiceUtils {

    static async getByCategory(category_fk: DatabaseKeySchema) {
        const products = await ProductsModel.select({ category_fk })

        if (products.length === 0) throw new ErrorHandler({
            message: "No se encontraron productos",
            status: 404,
            code: "products_not_found",
        })

        return products
    }

    static async updateByCategory(products: Array<ProductSchema.UpdateByCategory>) {
        const data = zodParse(productSchema.updateByCategory.array().min(1))(products)
        const res = await this.writeOperationsHandler(data, (e) => ProductsModel.updateByCategory(e),
        )
        res("products_update_by")
    }

    static async update(products: Array<ProductSchema.Update>) {
        const data = zodParse(productSchema.update.array().min(1))(products)
        const res = await this.writeOperationsHandler(data, (e) => ProductsModel.update(e))
        res("products_update")
    }

    static async insert(products: Array<ProductSchema.Insert>) {
        const data = zodParse(productSchema.insert.array().min(1))(products)
        const res = await this.writeOperationsHandler(data, (e) => ProductsModel.insert(e))
        res("products_insert")
    }

    static async delete(products: Array<ProductSchema.Delete>) {
        const data = zodParse(productSchema.delete.array().min(1))(products)
        const res = await this.writeOperationsHandler(data, (e) => ProductsModel.delete(e),
        )
        res("products_delete")
    }
}


export default ProductsService