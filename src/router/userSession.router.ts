import express from "express"
import UserSessionController from "../controller/userSession.controller.js"
import isUser from "../middleware/isUser.middleware.js"

const UserSession = express.Router()

UserSession.post("/login", UserSessionController.login)
UserSession.get("/logout",UserSessionController.logout)
UserSession.get("/", isUser, UserSessionController.getUserSession)

export default UserSession