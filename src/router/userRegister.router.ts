import express from "express"
import UserRegisterController from "../controller/userRegister.controller.js"
import isNotCompleteUser from "../middleware/isNotCompleteUser.middleware.js"

const userRegisterRouter = express.Router()

userRegisterRouter.post("/", UserRegisterController.register)
userRegisterRouter.get("/confirmation/:token", UserRegisterController.confirmRegistration)
userRegisterRouter.get("/send/token",isNotCompleteUser, UserRegisterController.sendRegisterToken)

export default userRegisterRouter