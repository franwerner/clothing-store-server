import StoreConfigService from "@/service/storeConfig.service";
import { StoreConfigSchema } from "clothing-store-shared/schema";
import { QuickStore } from "my-utilities";

/**
 * Mantenemos en memoria datos que sean parte del ciclo de vida durante el servidor funcionando.
 * Solo debe ser utilizado cuando los datos que persiste no cambian constantemente
 */

const store = QuickStore.create<{
    config: StoreConfigSchema.Base
}>()


try {
    const res = await StoreConfigService.getConfig()
    store.set("config", res)
} catch (error) {
    console.error("Configuracion de la tienda no encontrado")
}


export default store