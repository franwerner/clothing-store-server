const toNumber = (value:any) => {
    const number = Number(value)
    if (typeof number === "number" && !isNaN(number)) {
        return number
    } else {
       return 0
    }
}

export default toNumber