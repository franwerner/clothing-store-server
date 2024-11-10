import { NextFunction, Request, Response } from "express";
import ErrorHandlerDataBase from "../utils/ErrorHandlerDataBase.utilts.js";
import SizesModel, { Size } from "../model/sizes.model.js";

type SizesBody = { sizes: Array<Size> }

class SizeController {
    static async setSizes(req: Request<any, any, SizesBody>, res: Response, next: NextFunction) {
        try {

            const data = await SizesModel.insert(req.body.sizes)
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

    static async modifySizes(req: Request<any, any, SizesBody>, res: Response, next: NextFunction) {
        try {
            const sizes = req.body.sizes
            const data = await Promise.all(
                sizes.map(i => SizesModel.update(i))
            )
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

    static async getSizes(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await SizesModel.select()
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

    static async removeSizes(req: Request<any, any, { sizes: Array<number> }>, res: Response, next: NextFunction) {
        try {
            const data = await SizesModel.delete(req.body.sizes)
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

export default SizeController