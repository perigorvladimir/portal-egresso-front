import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav id="navbar" className="bg-blue-600 p-4 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Espaço para o Logo */}
        <div className="text-white text-2xl font-bold">LOGO AQUI</div>
        <ul className="flex space-x-4">
          <li className="text-white hover:underline cursor-pointer">Início</li>
          <li className="text-white hover:underline cursor-pointer">Sobre</li>
          <li className="text-white hover:underline cursor-pointer">Contato</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;