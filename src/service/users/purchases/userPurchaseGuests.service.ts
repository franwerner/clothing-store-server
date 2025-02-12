import { userPurchaseGuestsSchema, UserPurchaseGuestsSchema } from "clothing-store-shared/schema";
import zodParse from "@/helper/zodParse.helper";
import { Knex } from "knex";
import ErrorHandler from "@/utils/errorHandler.utilts";
import UserPurchaseGuestsModel from "@/model/users/purchases/userPurchaseGuest.model";
import creationLimits from "@/constant/creationLimit.constants";

class UserPurchaseGuestsService {

    static async isLimitExceeded(email: string, trx: Knex.Transaction) {
        const res = await UserPurchaseGuestsModel.select({ email }, (b) => b.transacting(trx).forUpdate())
        if (res.length >= creationLimits.user_purchase_guests) throw new ErrorHandler({
            message: "Has superado el límite de compras diarias con este correo electrónico.",
            code: "too_many_purchase_guests",
            status: 429
        })
    }
    static async create(props: UserPurchaseGuestsSchema.Insert, trx: Knex.Transaction) {
        const parse = zodParse(userPurchaseGuestsSchema.insert)(props)
        await this.isLimitExceeded(props.email, trx)
        const [res] = await UserPurchaseGuestsModel.insert(parse, trx)

        if (!res.affectedRows) throw new ErrorHandler({
            message: "Este correo ya está en uso. por favor utiliza otro para completar la compra.",
            code: "email_already_registered",
            status: 409
        })
    }
}

export default UserPurchaseGuestsService