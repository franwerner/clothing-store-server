const getAdjustedUTCDate = (UTC: number) => {
    const date = new Date()
    date.setUTCHours(date.getUTCHours() + UTC)
    return date
}

export default getAdjustedUTCDate