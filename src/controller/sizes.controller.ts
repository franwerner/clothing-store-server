import { NextFunction, Request } from "express";
import { SizeSchema } from "../schema/size.schema.js";
import SizeService from "../service/sizes.service.js";
import ErrorHandler from "../utils/errorHandler.utilts.js";
import ZodErrorHandler from "../utils/zodErrorHandler.utilts.js";
class SizeController {
    static async getSizes(
        _: Request,
        res: APP.ResponseTemplate<Array<SizeSchema.Base>>,
        next: NextFunction
    ) {
        try {
            const data = await SizeService.get();
            res.json({ data });
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
        res: APP.ResponseTemplateWithWOR<SizeSchema.Insert>,
        next: NextFunction
    ) {
        try {
            const data = await SizeService.insert(req.body)

            res.json({ data });
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
        res: APP.ResponseTemplateWithWOR<SizeSchema.Update>,
        next: NextFunction
    ) {
        try {
            const data = await SizeService.update(req.body)

            res.json({
                data,

            })
        } catch (error) {
            if (ErrorHandler.isInstanceOf(error)) {
                error.response(res);
            }  else {
                next()
            }
        }
    }

    static async removeSizes(
        req: Request,
        res: APP.ResponseTemplateWithWOR<SizeSchema.Delete>,
        next: NextFunction
    ) {
        try {
            const data = await SizeService.delete(req.body.sizes)

            res.json({ data })
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