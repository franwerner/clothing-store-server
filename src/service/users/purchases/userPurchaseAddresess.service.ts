import { userPurchaseAddressesSchema, UserPurchaseAddressesSchema } from "clothing-store-shared/schema";
import zodParse from "@/helper/zodParse.helper";
import { Knex } from "knex";
import UserPurchaseAddresessModel from "@/model/users/purchases/userPurchaseAddresess.model";

class UserPurchaseAddresessService {
    static async create(props: UserPurchaseAddressesSchema.Insert, tsx: Knex.Transaction) {
        const parse = zodParse(userPurchaseAddressesSchema.insert)(props)
        await UserPurchaseAddresessModel.insert(parse, (builder) => builder.transacting(tsx))
        return parse
    }

}

export default UserPurchaseAddresessService
