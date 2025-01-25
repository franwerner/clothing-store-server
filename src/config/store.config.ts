import { StoreConfigSchema } from "clothing-store-shared/schema"


const storeConfig: Omit<StoreConfigSchema.Base, "store_config_id"> & { isSync: boolean } = {
    isSync: false,
    cost_based_shipping: null,
    min_free_shipping: null
}

export default storeConfig