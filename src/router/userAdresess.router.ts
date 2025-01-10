import { Router } from "express"
import UserAdresessService from "../service/userAdresess.service"

const userAdresessRouter = Router()

userAdresessRouter.get("/", UserAdresessService.getAdress)
userAdresessRouter.post("/", UserAdresessService.createAdress)
userAdresessRouter.patch("/", UserAdresessService.updateAdress)

export default userAdresessRouter