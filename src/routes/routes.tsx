import { createBrowserRouter, useNavigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
// IMPORTS PAGINAS ABERTAS
import Home from '../pages/Home';
import Layout from '../pages/Layout'
import Depoimentos from '../pages/Depoimentos';
import Dados from '../pages/Dados'
// IMPORTS DO ADMIN
import LayoutAdmin from '../pages/admin/Layout';
import GerenciarEgresso from '../pages/admin/GerenciarEgresso';
import Login from '../pages/admin/Login';
import Dashboard from "../pages/admin/Dashboard";
import DepoimentoAdmin from "../pages/admin/Depoimento";

const isAuth = () => {
  return !!sessionStorage.getItem("token");
};

// componente que gerencia a verificação e redirecionamento
const RouterWrapper = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuth());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <LayoutAdmin /> : null; // renderiza se autenticado
};

// Definição das rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "depoimentos",
        element: <Depoimentos />,
      },
      {
        path: "dados",
        element: <Dados />
      }
    ]
  },
  {
    path: "/admin",
    element: <RouterWrapper />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "egresso",
        element: <GerenciarEgresso />,
      },
      {
        path: "depoimento",
        element: <DepoimentoAdmin />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;