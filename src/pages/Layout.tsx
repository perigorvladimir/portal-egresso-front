import React from 'react';
import logo from '../assets/images/image.png'
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate, Outlet } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  

  const items = [
      {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => navigate("/")
      },
      {
          label: 'Depoimentos',
          icon: 'pi pi-comment',
          command: () => navigate("/depoimentos")
      },
      {
          label: 'Dados',
          icon: 'pi pi-chart-scatter',
          command: () => navigate("/dados")
      }
  ];
  const start = <img alt="logo" src={logo} width="40" className="mr-2"></img>;

  const end = (
    <div className="flex align-items-center gap-8 mr-6">
        <Button label="Módulo Admin" link onClick={() =>  navigate('/admin')}/>
    </div>
  );

  return (
      <div className="home-admin">
          <Menubar model={items} start = {start} end = {end}/>
          <div className="content">
            <Outlet />
          </div>
      </div>
  )
}