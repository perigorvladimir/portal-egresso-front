import { Coordenador } from "./Coordenador"
export interface Curso{
    idCurso?: number,
    nome: string,
    tipoNivel: string,
    coordenador: Coordenador
}