import StoreConfigService from "@/service/storeConfig.service";
import ErrorHandler from "@/utils/errorHandler.utilts";
import { StoreConfigSchema } from "clothing-store-shared/schema";
import { QuickStore } from "my-utilities";

const errorHandler = new ErrorHandler({
    status: 404,
    message: "Problemas internos para encontrar la configuracion del servidor",
    code: "config_not_found"
})

const store = QuickStore.create<
    {
        config: StoreConfigSchema.Base
    },
    ErrorHandler
>({
    exception: () => errorHandler,
})

try {
    const res = await StoreConfigService.getConfig()
    store.set("config", res)
} catch (error) {
    console.error("Configuracion de la tienda no encontrado")
}


export default store