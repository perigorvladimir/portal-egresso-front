import React from 'react';
import logo from '../../assets/images/image.png'
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { useNavigate, Outlet } from 'react-router-dom';
import { Tooltip } from 'primereact/tooltip';

export default function Layout() {
  const navigate = useNavigate();

  const signOut = () => {
    //logica de deslogar
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    navigate("/login");
  }
  const nomeUser = sessionStorage.getItem("userName");
  

  const items = [
      {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => navigate("/admin")
      },
      {
          label: 'Gerenciar',
          icon: 'pi pi-database',
          items: [
            {
                label: 'Egresso',
                icon: 'pi pi-graduation-cap',
                command: () => navigate("/admin/egresso")
            },
            {
                label: 'Coordenador',
                icon: 'pi pi-id-card'
            },
        ]
      },
      {
          label: 'Depoimento',
          icon: 'pi pi-comment',
          command: () => navigate("/admin/depoimento")
      }
  ];
  const start = <img alt="logo" src={logo} width="40" className="mr-2"></img>;

  const end = (
    <div className="flex align-items-center gap-8 mr-6">
        <h2 className="pt-1">{nomeUser}</h2>
        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        <Tooltip target=".icone-logout" />
        <i className="icone-logout pi pi-sign-out pt-1" style={{ fontSize: '1.4rem', color: '#fc4e03', cursor: 'pointer' }} onClick={signOut} data-pr-tooltip="Logout" data-pr-position="bottom"/>
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