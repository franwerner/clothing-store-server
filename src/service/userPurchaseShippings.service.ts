import { userPurchaseShippingSchema, UserPurchaseShippingSchema } from "clothing-store-shared/schema";
import { Knex } from "knex";
import zodParse from "../helper/zodParse.helper";
import UserPurchaseShippingsModel from "../model/userPurchaseShippings.model";

class UserPurchaseShippingsService {

    static async create(props: UserPurchaseShippingSchema.Insert, tsx: Knex.Transaction) {
        const parse = zodParse(userPurchaseShippingSchema.insert)(props)
        const [res] = await UserPurchaseShippingsModel.insert(parse, (builder) => builder.transacting(tsx))
        return res
    }
    static async update(props: UserPurchaseShippingSchema.Update) {
        const parse = zodParse(userPurchaseShippingSchema.update)(props)
        await UserPurchaseShippingsModel.update(parse)
        return parse
    }
}


export default UserPurchaseShippingsService
