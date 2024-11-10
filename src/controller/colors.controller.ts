import { NextFunction, Request, Response } from "express";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import ColorsModel, { Color } from "../model/colors.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

interface ColorBody {
    colors: Array<Color>
}

const findNotHexadecimal = (colors: Array<Color>) => {
    const hexadecimalPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
    return colors.find(i => {
        const match = i.hexadecimal.match(hexadecimalPattern)
        return (match && match.length > 1) || (!match)
    })
}

class ColorsController {

    static async setColor(req: Request<any, any, ColorBody>, res: Response, next: NextFunction) {
        try {
            const { colors } = req.body
            const find = findNotHexadecimal(colors)

            if (find) {
                throw new ErrorHandler({ message: `El color ${find.color} no contienen un hexadecimal valido.`, status: 422 })
            }

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
            const find = findNotHexadecimal(colors)

            if (find) {
                throw new ErrorHandler({ message: `El color ${find.color} no contienen un hexadecimal valido`, status: 422 })
            }

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