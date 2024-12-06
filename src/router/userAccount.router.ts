import express from "express"
import UserAccountController from "../controller/userAccount.controller.js"
import isCompleteUser from "../middleware/isCompleteUser.middleware.js"
import isUser from "../middleware/isUser.middleware.js"

const userAccountRouter = express.Router()

userAccountRouter.post("/reset/password", UserAccountController.sendPasswordReset)
userAccountRouter.post("/reset/password/:token", UserAccountController.passwordReset)
userAccountRouter.post("/update/info",isCompleteUser, UserAccountController.updateInfo)
userAccountRouter.get("/",isUser,UserAccountController.getLoginUserInfo)

export default userAccountRouter
