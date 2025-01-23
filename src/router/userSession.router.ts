import express from "express"
import UserSessionController from "../controller/userSession.controller.js"

const UserSession = express.Router()

UserSession.post("/login", UserSessionController.login)
UserSession.get("/logout",UserSessionController.logout)

export default UserSession