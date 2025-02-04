import { StoreConfigSchema } from "clothing-store-shared/schema";
import ModelUtils from "@/utils/model.utils";
import sql from "@/config/knex.config";

class StoreConfigModel extends ModelUtils {
    static async select() {
        try {
            return await sql<StoreConfigSchema.Base>("store_config")
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async insert(props: StoreConfigSchema.Insert) {
        try {
            return await sql("store_config")
                .insert(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }
    static async update({ store_config_id, ...props }: StoreConfigSchema.Update) {
        try {
            return await sql("store_config")
                .where({ store_config_id })
                .update(props)
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default StoreConfigModel