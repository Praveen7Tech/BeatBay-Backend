
export const getDateRange = (range:string)=>{
    const now = new Date()
    const startDate = new Date()

    switch(range){
        case '7d': startDate.setDate(now.getDate() - 7);
        break;

        case "30d": startDate.setDate(now.getDate() - 30)
        break;

        case "90d": startDate.setDate(now.getDate() - 90)
        break;

        case "1y": startDate.setFullYear(now.getFullYear() - 1)
        break;

        default: startDate.setDate(now.getDate() - 7)
    }

    return startDate
}