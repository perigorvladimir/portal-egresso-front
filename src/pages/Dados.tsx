import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { cursoService } from "../services/CursoService";

export default function VisualizacaoDados() {
  const [dadosCursos, setDadosCursos] = useState<any>([]); // Dados para o gráfico de barras
  const [dadosCargos, setDadosCargos] = useState<any>([]); // Dados para o gráfico de pizza

  // Função para buscar dados de cursos e cargos
  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Requisição para buscar todos os cursos
        const responseCursos = await cursoService.getCursos();
        const cursos = responseCursos.dado;

        // Agora, para cada curso, buscamos a quantidade de egressos
        const dadosCursoComQuantidade = await Promise.all(
          cursos.map(async (curso: any) => {
            // Requisição para buscar a quantidade de egressos por curso
            const responseCurso = await cursoService.getQuantidadePorId(curso.idCurso);
            return {
              nome: curso.nome,
              quantidade: responseCurso.dado,
            };
          })
        );

        setDadosCursos(dadosCursoComQuantidade); // Atualiza os dados para o gráfico de barras

        // Requisição para buscar dados por cargo (igual ao código anterior)
        const responseCargos = await depoimentoService.getDadosPorCargo();
        setDadosCargos(responseCargos.dado); // Atualiza os dados para o gráfico de pizza
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  // Configuração do gráfico de barras (por curso)
  const dadosGraficoBarras = {
    labels: dadosCursos.map((curso: any) => curso.nome),
    datasets: [
      {
        label: "Quantidade de Egressos",
        data: dadosCursos.map((curso: any) => curso.quantidade),
        backgroundColor: "#64B5F6", // Cor das barras (suave e moderna)
        borderColor: "#2196F3", // Cor da borda das barras
        borderWidth: 2,
        hoverBackgroundColor: "#1976D2", // Cor ao passar o mouse
        hoverBorderColor: "#0D47A1", // Cor da borda ao passar o mouse
        hoverBorderWidth: 3,
      },
    ],
  };

  // Configuração do gráfico de pizza (por cargo)
  const dadosGraficoPizza = {
    labels: dadosCargos.map((cargo: any) => cargo.nome),
    datasets: [
      {
        data: dadosCargos.map((cargo: any) => cargo.quantidade),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#F3E5F5",
        ], // Cores diferentes para cada fatia
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  };

  // Opções de configuração do gráfico
  const graficoOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posição da legenda
        labels: {
          font: {
            size: 14, // Tamanho da fonte da legenda
            family: "'Roboto', sans-serif", // Fonte da legenda
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Cor de fundo da tooltip
        titleFont: {
          size: 16, // Tamanho da fonte do título da tooltip
        },
        bodyFont: {
          size: 14, // Tamanho da fonte do corpo da tooltip
        },
      },
    },
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        {/* Título da Página */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-semibold text-gray-700">Visualização de Dados</h2>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Gráfico de Barras (Quantidade de Egressos por Curso) */}
          <div className="col-span-1 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quantidade de Egressos por Curso</h3>
            <Chart type="bar" data={dadosGraficoBarras} options={graficoOptions} />
          </div>

          {/* Gráfico de Pizza (Quantidade de Egressos por Cargo) */}
          <div className="col-span-1 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quantidade de Egressos por Cargo</h3>
            <Chart type="pie" data={dadosGraficoPizza} options={graficoOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
