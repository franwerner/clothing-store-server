import { isString } from "my-utilities"

const adapteDateToDB = (date: Date | string) => {
    const x = isString(date) ? new Date(date) : date
    return x.toISOString().replace('T', ' ').substring(0, 19)
}

export default adapteDateToDB