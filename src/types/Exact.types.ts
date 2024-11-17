
type VerifyExact<Recived, Expected> =
    Recived extends Expected ? //Verifica si los tipos tos correctos.
    (keyof Recived extends keyof Expected ? Recived : never) //Verifica que no existan propiedades adicionales al objecto.
    : Expected;


type Exact<Recived, Expected> =
    Recived extends Array<infer U> ?
    Array<VerifyExact<U, Expected>> : VerifyExact<Recived, Expected>


export default Exact

