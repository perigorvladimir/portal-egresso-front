import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'
import Layout from '../pages/admin/Layout'
import GerenciarEgresso from '../pages/admin/GerenciarEgresso'
import VincularEmCurso from '../pages/admin/VincularEmCurso'
import Login from '../pages/admin/Login'
import Dashboard from "../pages/admin/Dashboard";
import Depoimento from "../pages/admin/Depoimento";

const isAuth = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/admin",
    element: isAuth ? <Layout /> : <Login />,
    children: [
      {
        index: true,
        element: <Dashboard/>
      },
      {
        path: "egresso",
        element: <GerenciarEgresso/> 
      },
      {
        path: "vincular",
        element: <VincularEmCurso/>
      },
      {
        path: "depoimento",
        element: <Depoimento/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  }
]);

export default router;