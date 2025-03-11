import axios from "axios";

const api = axios.create({
    baseUrl: 'http://localhost:8080',
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;