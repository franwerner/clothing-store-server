import { NextFunction, Request } from "express";
import { SizeSchema } from "../schema/size.schema.js";
import SizeService from "../service/sizes.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
class SizeController {
    static async getSizes(
        _: Request,
        res: APP.ResponseTemplate<Array<SizeSchema.Base>>,
        next: NextFunction
    ) {
        try {
            const data = await SizeService.get();
            res.json({ data, });
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res);
            } else {
                next();
            }
        }
    }

    static async addSizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await SizeService.insert(req.body)

            res.json({
                message: "Tamaños agregados correctamente."
            });
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res);
            } else {
                next();
            }
        }
    }

    static async modifySizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await SizeService.update(req.body)

            res.json({
                message: "Tamaños modificados correctamente."
            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res);
            } else {
                next()
            }
        }
    }

    static async removeSizes(
        req: Request,
        res: APP.ResponseTemplate,
        next: NextFunction
    ) {
        try {
            await SizeService.delete(req.body.sizes)

            res.json({
                message: "Tamaños eliminados correctamente."
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

export default SizeController