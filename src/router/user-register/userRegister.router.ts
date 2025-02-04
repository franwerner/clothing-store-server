import express from "express"
import isNotCompleteUser from "@/middleware/isNotCompleteUser.middleware.js"
import tokenRateLimiter from "@/rate-limiter/token.rate-limiter.js"
import UserRegisterController from "./userRegister.controller"

const userRegisterRouter = express.Router()

userRegisterRouter.post("/", UserRegisterController.register)
userRegisterRouter.get("/confirmation/:token", UserRegisterController.confirmRegistration)
userRegisterRouter.get("/send/token", tokenRateLimiter,isNotCompleteUser, UserRegisterController.sendRegisterToken)

export default userRegisterRouter