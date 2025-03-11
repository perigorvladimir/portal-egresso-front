import api from "../plugins/axios";
const baseUrl = "http://localhost:8080/portalegresso/api";
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
    async updateEgresso(id: number, egresso: any) {
        return api.put(`${baseUrl}/egresso/${id}`, egresso).then((res) => res.data);
    }
    async deleteEgresso(id: string) {
        return api.delete(`${baseUrl}/egresso/${id}`).then((res) => res.data);
    }
}


export const egressoService = new EgressoService();