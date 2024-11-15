import ErrorHandler from "../utils/ErrorHandler.utilts.js"

class IPservice {
    static IPv4(ip: string) {
        const regexp = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
        return regexp.test(ip)
    }
    static IPv6(ip: string) {
        const regexp = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6}))|(:((:[0-9a-fA-F]{1,4}){1,7}|:))|(::))$/
        return regexp.test(ip)
    }

    static IPv4MappedIPv6(ip: string) {
        const regexp = /^::ffff:(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
        return regexp.test(ip)
    }

    static isValidIP(ip: unknown) {
        if (typeof ip !== "string" || (!this.IPv4(ip) && !this.IPv6(ip) && !this.IPv4MappedIPv6(ip))) {
            throw new ErrorHandler({
                message: "No se pudo obtener la ip para procesar la solicitud.",
                status: 400
            })
        }
        return ip
    }
}

export default IPservice