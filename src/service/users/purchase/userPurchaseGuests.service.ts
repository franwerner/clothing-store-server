import { userPurchaseGuestsSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import zodParse from "@/helper/zodParse.helper";
import { Knex } from "knex";
import ErrorHandler from "@/utils/errorHandler.utilts";
import UserPurchaseGuestsModel from "@/model/users/purchases/userPurchaseGuest.model";

class UserPurchaseGuestsService {

    static async create(props: UserPurchaseGuestsSchema.Insert, knex: Knex.Transaction) {
        const parse = zodParse(userPurchaseGuestsSchema.insert)(props)
        const [res] = await UserPurchaseGuestsModel.insert(parse, knex)

        if (!res.affectedRows) throw new ErrorHandler({
            message: "Este correo ya está en uso. por favor utiliza otro para completar la compra.",
            code: "email_already_registered",
            status: 409
        })
    }
}

export default UserPurchaseGuestsService