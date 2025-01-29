import { isString } from "my-utilities"

const adapteDateToDB = (date: Date | string) => {
    const x = isString(date) ? date : date.toISOString()
    return x.replace('T', ' ').substring(0, 19)
}

export default adapteDateToDB