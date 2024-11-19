import express from "express"
import UserAccountController from "../controller/userAccount.controller.js"
import isUser from "../middleware/isUser.middleware.js"
import isConfirmedEmail from "../middleware/isConfirmedEmail.middleware.js"

const userAccountRouter = express.Router()

userAccountRouter.post("/reset/password", UserAccountController.sendPasswordReset)
userAccountRouter.post("/reset/password/:token", UserAccountController.passwordReset)
userAccountRouter.post("/update/info", isUser, isConfirmedEmail, UserAccountController.updateInfo)

export default userAccountRouter


