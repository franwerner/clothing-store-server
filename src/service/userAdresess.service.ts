import { DatabaseKeySchema, userAdresessSchema, UserAdresessSchema } from "clothing-store-shared/schema";
import UserAdresessModel from "../model/userAdresess.model";
import ErrorHandler from "../utils/errorHandler.utilts";
import zodParse from "../helper/zodParse.helper";

class UserAdresessService {

    static async createAdress(adress: UserAdresessSchema.Insert) {
        const parseData = zodParse(userAdresessSchema.insert)(adress)
        const [{ affectedRows }] = await UserAdresessModel.insert(parseData)
        if (affectedRows === 0) {
            throw new ErrorHandler({
                message: "Ya tienes una direccion creada.",
                status: 400,
                code: "adress_already_exists"
            })
        }
    }

    static async getAdress(user_fk: DatabaseKeySchema) {
        const [adress] = await UserAdresessModel.select({ user_fk })
        if (!adress) {
            throw new ErrorHandler({
                message: "No se encontro ninguna direccion",
                status: 404,
                code: "adress_not_found"
            })
        }
        return adress
    }

    static async updateAdress(adress: UserAdresessSchema.Update) {
        const parseData = zodParse(userAdresessSchema.update)(adress)
        await UserAdresessModel.update(parseData)
    }
}

export default UserAdresessService