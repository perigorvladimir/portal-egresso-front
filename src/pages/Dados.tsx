import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { cursoService } from "../services/CursoService";

export default function VisualizacaoDados() {
  const [dadosCursos, setDadosCursos] = useState<any>([]); // dado grafico de barras
  const [dadosCargos, setDadosCargos] = useState<any>([]); // dado grafico de pizza

  useEffect(() => {
    // buscar inicial
    const fetchDados = async () => {
      try {
        const responseCursos = await cursoService.getCursos();
        const cursos = responseCursos.dado;

        const dadosCursoComQuantidade = await Promise.all(
          cursos.map(async (curso: any) => {
            const responseCurso = await cursoService.getQuantidadePorId(curso.idCurso);
            return {
              nome: curso.nome,
              quantidade: responseCurso.dado,
            };
          })
        );

        setDadosCursos(dadosCursoComQuantidade);

        //const responseCargos = await depoimentoService.getDadosPorCargo();
        //setDadosCargos(responseCargos.dado);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  const dadosGraficoBarras = {
    labels: dadosCursos.map((curso: any) => curso.nome),
    datasets: [
      {
        label: "Quantidade de Egressos",
        data: dadosCursos.map((curso: any) => curso.quantidade),
        backgroundColor: "#64B5F6",
        borderColor: "#2196F3",
        borderWidth: 2,
        hoverBackgroundColor: "#1976D2",
        hoverBorderColor: "#0D47A1",
        hoverBorderWidth: 3,
      },
    ],
  };

  // configs grafico
  const dadosGraficoPizza = {
    labels: dadosCargos.map((cargo: any) => cargo.nome),
    datasets: [
      {
        data: dadosCargos.map((cargo: any) => cargo.quantidade),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#F3E5F5",
        ],
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  };

  // configs do grafico
  const graficoOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
      },
    },
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-semibold text-gray-700">Visualização de Dados</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* grafico de barras */}
          <div className="col-span-1 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quantidade de Egressos por Curso</h3>
            <Chart type="bar" data={dadosGraficoBarras} options={graficoOptions} />
          </div>

          {/* grafico de pizza */}
          <div className="col-span-1 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quantidade de Egressos por Cargo</h3>
            <Chart type="pie" data={dadosGraficoPizza} options={graficoOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
