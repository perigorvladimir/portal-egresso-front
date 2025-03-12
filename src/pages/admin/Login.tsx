import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';

interface LoginCredentials {
    login: string;
    senha: string;
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const LoginCredentials: LoginCredentials = { login: username, senha: password };
            const response = await authService.login(LoginCredentials);
            console.log(response);

            if (response.status === 200) {
                sessionStorage.setItem("token", response.data.token);
                sessionStorage.setItem("userName", response.data.nome);
                navigate('/admin');
            } else {
                setError(response.data.mensagem || 'Login failed');
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.mensagem || 'An error occurred');
        }
    };
    const apertouEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <InputText
                        id="username"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={apertouEnter}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <InputText
                        id="password"
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={apertouEnter}
                    />
                </div>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <Button
                    label="Login"
                    icon="pi pi-user"
                    className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={login}
                />
            </div>
        </div>
    );
}