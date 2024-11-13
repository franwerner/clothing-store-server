import { Color } from "../model/colors.model.js"
import ErrorHandler from "../utils/ErrorHandler.utilts.js"


class ColorService{

    static findNotHexadecimal(colors: Array<Color>){
        const hexadecimalPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
        const find = colors.find(i => {
            const match = i.hexadecimal.match(hexadecimalPattern)
            return (match && match.length > 1) || (!match)
        })

        if(find) {
            throw new ErrorHandler({ message: `El color ${find.color} no contienen un hexadecimal valido.`, status: 422 })
        }

       
    }
}


export default ColorService