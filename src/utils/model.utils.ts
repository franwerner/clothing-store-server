abstract class ModelUtils{

    static removePropertiesUndefined<T extends object>(properties:T){
        return Object.fromEntries(Object.entries(properties).filter(([_,value]) => value))
    }

}


export  default ModelUtils