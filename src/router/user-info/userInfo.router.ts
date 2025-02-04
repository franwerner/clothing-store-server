import express from "express"
import UserInfoController from "@/router/user-info/userInfo.controller.js"
import isCompleteUser from "@/middleware/isCompleteUser.middleware.js"
import tokenRateLimiter from "@/rate-limiter/token.rate-limiter.js"
import isAuthorizedToUpdateInfo from "./middleware/isAuthorizedToUpdateInfo.middleware.js"

const userInfoRouter = express.Router()

userInfoRouter.post("/reset/password", tokenRateLimiter, UserInfoController.sendPasswordReset)
userInfoRouter.post("/reset/password/:token", UserInfoController.passwordReset)
userInfoRouter.post("/update/auth", isCompleteUser, UserInfoController.updateInfoAuth)
userInfoRouter.patch("/update", [isCompleteUser, isAuthorizedToUpdateInfo], UserInfoController.updateInfo)

export default userInfoRouter
