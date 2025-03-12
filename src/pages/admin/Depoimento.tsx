import React, { useState, useEffect, useRef } from 'react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { egressoService } from "../../services/EgressoService";
import { depoimentoService } from "../../services/DepoimentoService";
import { Toast } from "primereact/toast";

interface SalvarDepoimentoRequest {
    idEgresso?: number,
    texto?: string
}

export default function CadastroDepoimento() {
    const toast = useRef<Toast>(null);
    const emptyDepoimentoRequest = {
        idEgresso: 0,
        texto: ""
    }
    const [egresso, setEgresso] = useState({
        nome: "",
        curso: "",
        anoConclusao: "",
        depoimento: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [egressos, setEgressos] = useState([]);
    const [salvarDepoimentoRequest, setSalvarDepoimento] = useState<SalvarDepoimentoRequest>(emptyDepoimentoRequest);

    useEffect(() => {
        //busca inicial
        egressoService.getEgressos().then((data) => setEgressos(data.dado));
    }, []);

    const handleSubmit = async () => {
        setSubmitted(true);
        console.log("otario", salvarDepoimentoRequest)
        console.log("Enviando:", egresso);
        try {
            const response = await depoimentoService.salvarDepoimento(salvarDepoimentoRequest).then((data) => console.log(data));
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Depoimento salvo com sucesso!', life: 3000 });

            setSalvarDepoimento(emptyDepoimentoRequest);
        } catch (error: any) {
            console.error("Erro ao salvar o depoimento:", error);

            // Verifica se 'detalhes' é um array ou uma string
            const errorDetails = Array.isArray(error?.response?.data.detalhes)
                ? error.response.data.detalhes.join(', ') // Junta os itens do array como uma string
                : error?.response?.data.detalhes || "Erro desconhecido"; // Caso contrário, apenas pega a string ou um valor padrão

            toast.current?.show({ severity: 'error', summary: 'Erro', detail: `Não foi possível salvar o depoimento. \nMotivo: ${errorDetails}`, life: 3000 });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Toast ref={toast} />
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Cadastrar Depoimento</h2>
                {/* egresso */}
                <div>
                    <label htmlFor="egresso" className="font-bold text-lg">Egresso</label>
                    <Dropdown
                        editable
                        showClear
                        id="egresso"
                        value={egressos.find(egresso => egresso.idEgresso === salvarDepoimentoRequest.idEgresso) || null}
                        onChange={(e) => setSalvarDepoimento({
                            ...salvarDepoimentoRequest,
                            idEgresso: e.value ? e.value.idEgresso : null // Se e.value for null, limpa o ID
                        })}
                        options={egressos}
                        optionLabel={(option) => option ? `${option.nome} - ${option.email}` : ""}
                        placeholder="Selecione um egresso"
                        className="w-full"
                    />
                </div>

                {/* depoimento */}
                <div className="mb-4">
                    <label htmlFor="depoimento" className="font-bold">Depoimento</label>
                    <InputTextarea
                        id="depoimento"
                        rows={4}
                        className={classNames("w-full p-2 border rounded")}
                        value={salvarDepoimentoRequest.texto}
                        onChange={(e) => setSalvarDepoimento({ ...salvarDepoimentoRequest, texto: e.target.value })}
                    />
                </div>

                {/* botao enviar */}
                <Button
                    label="Cadastrar"
                    icon="pi pi-check"
                    className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}