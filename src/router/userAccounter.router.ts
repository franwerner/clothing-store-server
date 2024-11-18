import express from "express"
import UserAccountController from "../controller/userAccount.controller.js"

const userAccountRouter = express.Router()

userAccountRouter.get("/password/update",UserAccountController.passwordUpdate)

export default userAccountRouter