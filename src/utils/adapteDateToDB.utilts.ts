
const adapteDateToDB = (date: Date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19)
}

export default adapteDateToDB