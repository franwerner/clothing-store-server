import { userPurchaseAddressesSchema, UserPurchaseAddressesSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper";
import UserPurchaseAddresessModel from "../model/userPurchaseAddresess.model";
import ErrorHandler from "../utils/errorHandler.utilts";
import { Knex } from "knex";

class UserPurchaseAddresessService {
    static async create(props: UserPurchaseAddressesSchema.Insert, tsx: Knex.Transaction) {
        const parse = zodParse(userPurchaseAddressesSchema.insert)(props)
        await UserPurchaseAddresessModel.insert(parse, (builder) => builder.transacting(tsx))
        return parse
    }
    // static async get(user_purchase_address_id: DatabaseKeySchema) {
    //     const [res] = await UserPurchaseAddresessModel.select({ user_purchase_address_id: user_purchase_address_id })
    //     if (!res) throw new ErrorHandler({
    //         code: "userPurchaseAddresess_not_created",
    //         status: 400,
    //     })
    // }
}

export default UserPurchaseAddresessService
