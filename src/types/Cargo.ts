import { Egresso } from "./Egresso"
export interface Cargo{
    idCargo?: number,
    descricao: number,
    tipoAreaTrabalho: string,
    local: string,
    anoInicio: string,
    anoFim: string,
    egresso: Egresso
}