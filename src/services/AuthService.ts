import api from "../plugins/axios";
const baseUrl = import.meta.env.VITE_API_URL;
class AuthService {
    async login(credenciais: any)  {
        return api.post(`${baseUrl}/auth/login`, credenciais).then((res) => res);
    }
}


export const authService = new AuthService();