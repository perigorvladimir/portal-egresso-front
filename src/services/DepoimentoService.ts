import api from "../plugins/axios";
const baseURL = import.meta.env.VITE_API_URL;

class DepoimentoService {
    async salvarDepoimento(depoimentoRequest: any) {
        return api.post(`${baseURL}/depoimento`, depoimentoRequest).then((res) => res.data);
    }
    async getPorAno(ano: any){
        return api.get(`${baseURL}/depoimento/porAno/${ano}`).then((res) => res.data);
    }
    async getRecentes(){
        return api.get(`${baseURL}/depoimento/recentes`).then((res) => res.data);
    }
}

export const depoimentoService = new DepoimentoService();