import express from "express"
import UserSessionController from "./userSession.controller"
import isUser from "@/middleware/isUser.middleware"


const UserSession = express.Router()

UserSession.post("/login", UserSessionController.login)
UserSession.get("/logout",UserSessionController.logout)
UserSession.get("/", isUser, UserSessionController.getUserSession)

export default UserSession