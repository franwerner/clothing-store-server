import { DatabaseKeySchema, userAddressesSchema, UserAddressesSchema } from "clothing-store-shared/schema";
import zodParse from "../helper/zodParse.helper";
import UserAddresessModel from "../model/userAddresess.model";
import ErrorHandler from "../utils/errorHandler.utilts";

class UserAddresessService {

    static async createAddress(address: UserAddressesSchema.Insert): Promise<UserAddressesSchema.Base> {
        const parseData = zodParse(userAddressesSchema.insert)(address)
        const { locality, province } = parseData
        await this.validateLocation({ locality, province })
        const [insertID] = await UserAddresessModel.insert(parseData)
        if (!insertID) {
            throw new ErrorHandler({
                message: "Ya tienes una direccion creada.",
                status: 400,
                code: "address_already_exists"
            })
        }
        return {
            ...parseData,
            user_address_id: insertID
        }
    }

    static async getAddress(user_fk: DatabaseKeySchema) {
        const [address] = await UserAddresessModel.select({ user_fk })
        if (!address) {
            throw new ErrorHandler({
                message: "No se encontro ninguna direccion",
                status: 404,
                code: "address_not_found"
            })
        }
        return address
    }

    static async validateLocation({ locality, province }: { locality?: string, province?: string }) {
        const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${province}&nombre=${locality}&exacto=true&campos=nombre`)
        const json = await res.json()
        if (!json.cantidad) {
            throw new ErrorHandler({
                status: 403,
                message: "La provincia o localidad ingresada es incorrecta.",
                code: "wrong_location"
            })
        }
    }

    static async updateAddress(address: UserAddressesSchema.Update) {
        const parseData = zodParse(userAddressesSchema.update)(address)
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