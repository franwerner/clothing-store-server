import { NextFunction, Request } from "express";
import ColorsModel from "../model/colors.model.js";
import { ColorSchema } from "../schema/color.schema.js";
import ColorsService from "../service/colors.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";

class ColorsController {

    static async addColors(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ColorSchema.Insert>,
        next: NextFunction
    ) {
        try {
            const data = await ColorsService.insert(req.body)
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

    static async modifyColors
        (req: Request,
            res: APP.ResponseTemplateWithWOR<ColorSchema.Update>,
            next: NextFunction
        ) {

        try {
            const data = await ColorsService.update(req.body)
            res.json({
                data
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

    static async removeColors(
        req: Request,
        res: APP.ResponseTemplateWithWOR<ColorSchema.Delete>,
        next: NextFunction
    ) {
        try {
            const data = await ColorsService.delete(req.body)

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

    static async getColors(
        _: Request, 
        res: APP.ResponseTemplate<ColorSchema.Base[]>,
        next: NextFunction
    ) {
        try {
            const data = await ColorsModel.select()
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            } else {
                next()
            }
        }
    }

}

export default ColorsController