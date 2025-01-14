import express from "express"
import UserAccountController from "../controller/userAccount.controller.js"
import isCompleteUser from "../middleware/isCompleteUser.middleware.js"
import isUser from "../middleware/isUser.middleware.js"
import tokenRateLimiter from "../rate-limiter/token.rate-limiter.js"
import isAuthorizedToUpdateInfo from "../middleware/isAuthorizedToUpdateInfo.middleware.js"

const userAccountRouter = express.Router()

userAccountRouter.post("/reset/password", tokenRateLimiter, UserAccountController.sendPasswordReset)
userAccountRouter.post("/reset/password/:token", UserAccountController.passwordReset)
userAccountRouter.post("/update/info/auth", isCompleteUser, UserAccountController.updateInfoAuth)
userAccountRouter.post("/update/info", [isCompleteUser, isAuthorizedToUpdateInfo], UserAccountController.updateInfo)
userAccountRouter.get("/", isUser, UserAccountController.getUserInfo)

export default userAccountRouter