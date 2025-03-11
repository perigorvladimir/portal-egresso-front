import { Cargo } from "./Cargo"
import { Curso } from "./Curso"
import { Depoimento } from "./Depoimento"

export interface Egresso {
    idEgresso?: number,
    nome: string,
    email: string,
    descricao: string,
    foto: string,
    linkedin: string,
    instagram: string,
    curriculo: string,
    cargos: Cargo[],
    cursos: Curso[],
    depoimento: Depoimento[]
}