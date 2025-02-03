import sql from "@/config/knex.config";
import ModelUtils from "@/utils/model.utils";
import { UserSyncStatusSchema } from "clothing-store-shared/schema";

class UserSyncStatusModel extends ModelUtils {

    static async select(
        props: Partial<UserSyncStatusSchema.Base>,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_sync_status")
                .where(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async insert(
        props: UserSyncStatusSchema.Insert,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_sync_status")
                .insert(props)
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }

    static async update(
        { user_sync_status, ...props }: UserSyncStatusSchema.Update,
        modify?: APP.ModifySQL
    ) {
        try {
            const query = sql("user_sync_status")
                .update(props)
                .where({ user_sync_status })
            modify && query.modify(modify)
            return await query
        } catch (error) {
            throw this.generateError(error)
        }
    }
}

export default UserSyncStatusModel