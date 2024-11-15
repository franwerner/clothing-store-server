import ErrorHandlerDataBase from "./ErrorHandlerDataBase.utilts.js"

abstract class ModelUtils{

    static removePropertiesUndefined<T extends object>(properties:T){
        return Object.fromEntries(Object.entries(properties).filter(([_,value]) => value))
    }

    static generateError(error:unknown){
        if (ErrorHandlerDataBase.isSqlError(error)) {
            return new ErrorHandlerDataBase(error)
        }
        return error
    }

}


export  default ModelUtils