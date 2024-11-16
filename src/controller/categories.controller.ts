import { NextFunction, Request, Response } from "express";
import CategoriesModel, { Category } from "../model/categories.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

class CategoriesController {

    static async getCategoriesPerBrand(req: Request, res: Response, next: NextFunction) {
        try {
            const { brand_id } = req.params
            const data = await CategoriesModel.select({ brand_fk : brand_id})

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


    static async setCategories(req: Request<any, any, { categories: Array<Category> }>, res: Response, next: NextFunction) {
        try {
            const data = await CategoriesModel.insert(req.body.categories)
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

    static async modifyCategories(req: Request<any, any, { categories: Array<Category> }>, res: Response, next: NextFunction) {
        try {
            const categories = req.body.categories

            const data = await Promise.all(
                categories.map((i) => CategoriesModel.update(i))
            )
            
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

    static async removeCategories(req: Request<any, any, { categories: Array<number> }>, res: Response, next: NextFunction) {

        try {
            const categories = req.body.categories
            const data = await CategoriesModel.delete(categories)
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
}

export default CategoriesController