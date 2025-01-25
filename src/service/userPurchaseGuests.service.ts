import { userPurchaseGuestsSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper";
import UserPurchaseGuestsModel from "../model/userPurchaseGuest.model";
import ErrorHandler from "../utils/errorHandler.utilts";
import { Knex } from "knex";

class UserPurchaseGuestsService {

    static async create(props: UserPurchaseGuestsSchema.Insert, knex: Knex.Transaction) {
        const parse = zodParse(userPurchaseGuestsSchema.insert)(props)
        const [res] = await UserPurchaseGuestsModel.insert(parse, (builder) => builder.transacting(knex))
        if (!res) throw new ErrorHandler({
            status: 403,
            code: "userPurchaseGuests_not_created",
        })
    }
}

export default UserPurchaseGuestsService