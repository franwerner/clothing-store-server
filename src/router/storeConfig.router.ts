import { Router } from "express"
import StoreConfigController from "../controller/storeConfig.controller"
import isAdmin from "../middleware/isAdmin.middleware"
const storeConfig = Router()

storeConfig.get("/", StoreConfigController.getConfig)
storeConfig.post("/", isAdmin, StoreConfigController.createConfig)
storeConfig.patch("/", isAdmin, StoreConfigController.updateConfig)

export default storeConfig