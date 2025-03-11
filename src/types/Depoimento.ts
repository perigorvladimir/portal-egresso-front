import { Egresso } from "./Egresso"

export interface Depoimento{
    idDepoimento?: number,
    texto: string,
    data: Date,
    egresso: Egresso
}