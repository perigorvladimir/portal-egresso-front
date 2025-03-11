import { Curso } from "./Curso"
export interface Coordenador{
    idCoordenador?: number,
    nome: string,
    login: string,
    cursos: Curso[]
}