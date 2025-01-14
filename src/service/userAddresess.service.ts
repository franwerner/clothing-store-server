import { DatabaseKeySchema, userAddresessSchema, UserAddresessSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper";
import UserAddresessModel from "../model/userAddresess.model";
import ErrorHandler from "../utils/errorHandler.utilts";

class UserAddresessService {

    static async createAddress(address: UserAddresessSchema.Insert): Promise<UserAddresessSchema.Base> {
        const parseData = zodParse(userAddresessSchema.insert)(address)
        const { locality, province } = parseData
        await this.validateLocation({ locality, province })
        const [{ affectedRows, insertId }] = await UserAddresessModel.insert(parseData)
        if (affectedRows === 0) {
            throw new ErrorHandler({
                message: "Ya tienes una direccion creada.",
                status: 400,
                code: "address_already_exists"
            })
        }
        return {
            ...parseData,
            user_address_id: insertId
        }
    }

    static async getAddress(user_fk: DatabaseKeySchema) {
        const [adress] = await UserAddresessModel.select({ user_fk })
        if (!adress) {
            throw new ErrorHandler({
                message: "No se encontro ninguna direccion",
                status: 404,
                code: "address_not_found"
            })
        }
        return adress
    }

    static async validateLocation({ locality, province }: { locality?: string, province?: string }) {
        const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${province}&nombre=${locality}&exacto=true&campos=nombre`)
        const json = await res.json()
        if (!json.cantidad) {
            throw new ErrorHandler({
                status: 403,
                message: "La provincia o localidad ingresada es incorrecta.",
                code: "wrong_localation"
            })
        }
    }

    static async updateAddress(address: UserAddresessSchema.Update) {
        const parseData = zodParse(userAddresessSchema.update)(address)
        const { locality, province } = parseData
        if (locality || province) {
            await this.validateLocation({ locality, province })
        }
        const res = await UserAddresessModel.update(parseData)
        if (res === 0) throw new ErrorHandler({
            code: "update_user_address_failed",
            message: "No se logro actualizar la direccion.",
            status: 403,
        })
        return parseData
    }
}

export default UserAddresessService