import { Router } from "express"
import UserAddresessController from "./userAddresses.controller"

const userAddresessRouter = Router()

userAddresessRouter.get("/", UserAddresessController.getAddress)
userAddresessRouter.post("/", UserAddresessController.createAddress)
userAddresessRouter.patch("/", UserAddresessController.updateAddress)

export default userAddresessRouter