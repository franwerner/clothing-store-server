import { NextFunction, Request } from "express"
import isUser from "@/middleware/isUser.middleware"
import errorGlobal from "@/middleware/errorGlobal.middleware"
import ErrorHandler from "@/utils/errorHandler.utilts"
import UsersModel from "@/model/users/users.model"
import UserPurchasesService from "@/service/users/purchases/userPurchases.service"

const syncGuestPurchases = async (
    req: Request,
    res: APP.ResponseTemplate,
    next: NextFunction
) => {
    try {
        const user = req.session.user_info
        if (!user) return isUser(req, res, next)
        else if (user.guest_purchases_synced) return next()
        const [{ guest_purchases_synced }] = await UsersModel.select({ user_id: user.user_id }, (b) => b.select("guest_purchases_synced"))
        if (!guest_purchases_synced) {
            await UserPurchasesService.syncGuestPurchases(user)
        }
        user.guest_purchases_synced = true
        next()
    } catch (error) {
        if (ErrorHandler.isInstanceOf(error)) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }
}

export default syncGuestPurchases