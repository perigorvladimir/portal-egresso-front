import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EgressoCard from "../components/EgressoCard";

interface Egresso {
  id: number;
  nome: string;
  ano: number;
  curso: string;
}

const EGRESSOS_INICIAIS: Egresso[] = [
  { id: 1, nome: "Maria Silva", ano: 2020, curso: "Engenharia" },
  { id: 2, nome: "João Souza", ano: 2019, curso: "Computação" },
  { id: 3, nome: "Ana Costa", ano: 2021, curso: "Administração" },
  { id: 4, nome: "Carlos Lima", ano: 2018, curso: "Matemática" },
];

const Home: React.FC = () => {
  const [egressos, setEgressos] = useState<Egresso[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const embaralhado = [...EGRESSOS_INICIAIS].sort(() => Math.random() - 0.5);
    setEgressos(embaralhado);
  }, []);

  const egressosFiltrados = egressos.filter((egresso) =>
    egresso.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div id="home" className="bg-gray-100 w-full min-h-screen">
      <Navbar />

      <div className="container mx-auto">
        {/* Campo de Busca */}
        <div id="busca" className="pt-16 mb-6">
          <input
            type="text"
            placeholder="Buscar egresso..."
            className="w-full p-3 border rounded-lg shadow-md focus:ring focus:ring-blue-300"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Grid de Egressos */}
        <div id="grid" className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {egressosFiltrados.length > 0 ? (
            egressosFiltrados.map((egresso) => (
              <EgressoCard key={egresso.id} egresso={egresso} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              Nenhum egresso encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;