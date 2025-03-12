import api from "../plugins/axios";
import { Egresso } from "../types/Egresso";
const baseUrl = import.meta.env.VITE_API_URL;
class EgressoService {
    async getEgressos()  {
        return api.get(`${baseUrl}/egresso`).then((res) => res.data);
    }
    async getEgressoById(id: string) {
        return api.get(`${baseUrl}/egresso/${id}`).then((res) => res.data);
    }
    async saveEgresso(egresso: any) {
        return api.post(`${baseUrl}/egresso`, egresso).then((res) => res.data);
    }
    async updateEgresso(id: number, egresso: Egresso) {
        return api.put(`${baseUrl}/egresso/${id}`, egresso).then((res) => res.data);
    }
    async deleteEgresso(id: number) {
        return api.delete(`${baseUrl}/egresso/${id}`).then((res) => res.data);
    }
    async vincularACurso(idEgresso: number, dadosCurso: any) {
        return api.post(`${baseUrl}/egresso/${idEgresso}/curso`, dadosCurso).then((res) => res.data);
    }
}


export const egressoService = new EgressoService();