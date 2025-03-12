import api from "../plugins/axios";
const baseURL = import.meta.env.VITE_API_URL;

class CoordenadorService {
    async getCoordenadores()  {
        return api.get(`${baseURL}/coordenador`).then((res) => res.data);
    }
    // async saveCoordenador(coordenador: any) {
    //     return api.post(`${baseURL}/coordenador`, coordenador).then((res) => res.data);
    // }
    // async updateCoordenador(id: number, coordenador: any) {
    //     return api.put(`${baseURL}/coordenador/${id}`, coordenador).then((res) => res.data);
    // }
}

export const coordenadorService = new CoordenadorService();