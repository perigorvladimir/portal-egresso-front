import React from "react";

interface Egresso {
  nome: string;
  email: string;
  linkedin: string;
  curso: string;
}

const EgressoCard: React.FC<{ egresso: Egresso }> = ({ egresso }) => {
  return (
    <div id="egressoCard" className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
      <h2 className="text-xl font-bold text-blue-700">{egresso.nome}</h2>
      <p className="text-gray-600">Ano de formação: {egresso.curso}</p>
      <p className="text-gray-500">Curso: {egresso.curso}</p>
    </div>
  );
};

export default EgressoCard;