import { Router } from "express"
import StoreConfigController from "../controller/storeConfig.controller"
import isAdmin from "../middleware/isAdmin.middleware"
const storeConfigRouter = Router()

storeConfigRouter.get("/", StoreConfigController.getConfig)
storeConfigRouter.post("/", isAdmin, StoreConfigController.createConfig)
storeConfigRouter.patch("/", isAdmin, StoreConfigController.updateConfig)

export default storeConfigRouter