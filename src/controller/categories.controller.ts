import { NextFunction, Request } from "express";
import { CategorySchema } from "clothing-store-shared/schema";
import CategoriesService from "../service/categories.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";



class CategoriesController {

    static async getByBrand(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            const { brand_id } = req.params
            const data = await CategoriesService.getByBrand(brand_id)
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


    static async addCategories(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await CategoriesService.insert(req.body)

            res.json({
                message: "Categorias agregadas exitosamente."
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await CategoriesService.update(req.body)

            res.json({
                message: "Categorias modificadas exitosamente."
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
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {

        try {
            await CategoriesService.delete(req.body)

            res.json({
                message: "Todas las categorias se removiero exitosamente.",
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