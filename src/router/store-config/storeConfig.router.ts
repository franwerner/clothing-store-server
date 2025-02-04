import isAdmin from "@/middleware/isAdmin.middleware"
import { Router } from "express"
import StoreConfigController from "./storeConfig.controller"

const storeConfigRouter = Router()

storeConfigRouter.get("/", StoreConfigController.getConfig)
storeConfigRouter.post("/", isAdmin, StoreConfigController.createConfig)
storeConfigRouter.patch("/", isAdmin, StoreConfigController.updateConfig)

export default storeConfigRouter