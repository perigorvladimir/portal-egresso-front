import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { egressoService } from '../../services/EgressoService';
import { cursoService } from '../../services/CursoService';
import { coordenadorService } from '../../services/CoordenadorService';

export default function Dashboard() {
    const navigate = useNavigate();
    const [qntEgressos, setQntEgressos] = useState<number>(0);
    const [qntCursos, setQntCursos] = useState<number>(0);
    const [qntCoordenadores, setQntCoordenadores] = useState<number>(0);

    useEffect(() => {
        //busca inicial
        egressoService.getEgressos().then((data) => setQntEgressos(data.dado.length));
        coordenadorService.getCoordenadores().then((data) => setQntCoordenadores(data.dado.length));
        cursoService.getCursos().then((data) => setQntCursos(data.dado.length));
    }, []);

    // Exemplo de dados para um gráfico
    const data = {
        labels: ['Egressos', 'Cursos', 'Coordenadores'],
        datasets: [
            {
                label: 'Salvos',
                data: [qntEgressos, qntCursos, qntCoordenadores],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 159, 64)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            },
        ],
    };
    return (
        <div className="p-6 w-[90%] m-auto">
            <h2 className="text-3xl font-semibold text-center mb-8">Bem-vindo ao Portal Egresso</h2>

            <div className="grid place-items-center h-70 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Descrição do Sistema */}
                <div className="col-span-1" style={{ width: '70%' }}>
                    <Card title="O que é o Sistema?" className="shadow-lg">
                        <p>
                            Este sistema foi desenvolvido para gerenciar os dados de alunos, coordenadores e cursos de
                            forma eficiente e intuitiva. Ele oferece funcionalidades para visualização, cadastro e
                            gerenciamento de informações, visando facilitar a administração e controle.
                        </p>
                    </Card>
                </div>

                {/* Cards com ícones explicativos */}
                <div className="col-span-1" style={{ width: '70%' }}>
                    <Card className="shadow-lg p-4">
                        <div className="flex flex-col items-center justify-center">
                            <h4 className="text-xl font-medium mb-2">Gerenciar Egressos</h4>
                            <p className="text-gray-600 mb-4">Administre os egressos do sistema com facilidade.</p>
                            <Button
                                label="Ver Egressos"
                                icon="pi pi-arrow-right"
                                onClick={() => navigate('/admin/egresso')}
                                className="p-button-link text-blue-500 hover:text-blue-700"
                            />
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid m-auto p-fluid w-full mt-5">
                <div className="col-12 w-[70%] m-auto md:col-6">
                    <Card title="Gráfico - Quantidade Entidades Salvas" className="shadow-lg">
                        <Chart type="bar" data={data} />
                    </Card>
                </div>
            </div>
        </div>
    );
}