import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { depoimentoService } from "../services/DepoimentoService";
import { Depoimento } from "../types/Depoimento";

export default function Depoimentos() {
  const [depoimentosRecentes, setDepoimentosRecentes] = useState<Depoimento[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState<string>("");
  const [depoimentosPorAno, setDepoimentosPorAno] = useState<Depoimento[]>([]);
  const [mostrarPorAno, setMostrarPorAno] = useState(false);

  const shuffleArray = (array: Depoimento[]) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // troca os elementos
    }
    return shuffledArray;
  };

  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        const recentes = await depoimentoService.getRecentes();
        setDepoimentosRecentes(shuffleArray(recentes.dado));
      } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
      }
    };

    fetchDepoimentos();
  }, []);

  const buscarDepoimentosPorAno = async () => {
    try {
      const response = await depoimentoService.getPorAno(anoSelecionado);
      setDepoimentosPorAno(response.dado);
      setMostrarPorAno(true);
    } catch (error) {
      console.error("Erro ao buscar depoimentos por ano:", error);
    }
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-semibold">Depoimentos</h2>
          <div className="flex items-center gap-4">
            {/* selecionar ano */}
            <InputText
              type="number"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              placeholder="Ano"
              className="p-inputtext-sm"
            />
            <Button
              label="Buscar por Ano"
              icon="pi pi-search"
              onClick={buscarDepoimentosPorAno}
              className="p-button-sm p-button-rounded p-button-info"
            />
          </div>
        </div>

        {/* exibir */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* por ano ou recentes */}
          {(mostrarPorAno ? depoimentosPorAno : depoimentosRecentes).map(
            (depoimento, index) => (
              <Card
                key={index}
                title={`${depoimento.egresso.nome} - ${new Date(depoimento.data).toLocaleDateString('pt-BR')}`}
                subTitle={depoimento.egresso.cursos[0].nome}
                className="p-shadow-2"
              >
                <p className="text-gray-700">{depoimento.texto}</p>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
