import { NextFunction, Request, Response } from "express";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import ColorsModel, { Color } from "../model/colors.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";
import ColorService from "../service/color.service.js";

interface ColorBody {
    colors: Array<Color>
}

class ColorsController {

    static async setColor(req: Request<any, any, ColorBody>, res: Response, next: NextFunction) {
        try {
            const { colors } = req.body

            ColorService.findNotHexadecimal(colors)

            const data = await ColorsModel.insert(colors)
            
            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

    static async modifyColor(req: Request<any, any, ColorBody>, res: Response, next: NextFunction) {

        try {
            const { colors } = req.body

            ColorService.findNotHexadecimal(colors)

            const data = await Promise.all(colors.map(i => ColorsModel.update(i)))

            res.json({
                data
            })

        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res)
            }
            else if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

    static async removeColors(req: Request<any, any, { colors: Array<number> }>, res: Response, next: NextFunction) {

        try {
            const { colors } = req.body

            const data = await ColorsModel.delete(colors)

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

    static async getColors(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ColorsModel.select()

            res.json({
                data
            })
        } catch (error) {
            if (ErrorHandlerDataBase.isSqlError(error)) {
                new ErrorHandlerDataBase(error).response(res)
            } else {
                next()
            }
        }
    }

}

export default ColorsController