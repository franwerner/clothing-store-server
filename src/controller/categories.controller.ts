import { NextFunction, Request } from "express";
import CategoriesModel from "../model/categories.model.js";
import brandSchema, { BrandSchema } from "../schema/brand.schema.js";
import categorySchema, { CategorySchema } from "../schema/category.schema.js";
import CategoriesService from "../service/categories.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class CategoriesController {

    static async getCategoriesPerBrand(
        req: Request,
        res: APP.ResponseTemplate<CategorySchema.Base[]>,
         next: NextFunction
        ) {
        try {
            const { brand_id } = req.params
            const data = await CategoriesModel.select({ brand_fk: brand_id })

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }


    static async addCategories(
        req: Request,
        res: APP.ResponseTemplateWithWOR<CategorySchema.Insert>,
        next: NextFunction
    ) {
        try {
            const categories = categorySchema.insert.array().parse(req.body)

            const data = await CategoriesService.insert(categories)

            res.json({
                data
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async modifyCategories(
        req: Request,
        res: APP.ResponseTemplateWithWOR<CategorySchema.Update>,
        next: NextFunction
    ) {
        try {
            const categories = categorySchema.update.array().parse(req.body)

            const data = await CategoriesService.update(categories)

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }

    static async removeCategories(
        req: Request,
        res: APP.ResponseTemplateWithWOR<BrandSchema.Delete>,
        next: NextFunction
    ) {

        try {
            const categories = brandSchema.delete.array().parse(req.body)
            const data = await CategoriesService.delete(categories)

            res.json({
                data,
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else {
                next()
            }
        }
    }
}

export default CategoriesController