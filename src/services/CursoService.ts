import api from "../plugins/axios";
const baseURL = import.meta.env.VITE_API_URL;

class CursoService {
    async getCursos()  {
        return api.get(`${baseURL}/curso`).then((res) => res.data);
    }
    async getCursoPorId(id: any) {
        return api.get(`${baseURL}/curso/${id}`).then((res) => res.data);
    }
    async getQuantidadePorId(id: any){
        return api.get(`${baseURL}/curso/quantidade/${id}`).then((res) => res.data);
    }
}

export const cursoService = new CursoService();