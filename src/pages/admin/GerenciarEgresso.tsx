import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { egressoService } from '../../services/EgressoService';
import { cursoService } from '../../services/CursoService';
import { Egresso } from '../../types/Egresso';
import { InputNumber } from 'primereact/inputnumber';
import { Curso } from '../../types/Curso';


interface SalvarEgressoRequest extends Egresso {
    idCurso?: number | null,
    anoInicioCurso?: number | null,
    anoFimCurso?: number | null
}
interface CursoEgresso {
    idCurso?: number | null,
    anoInicio?: number | null,
    anoFim?: number | null
}


export default function GerenciarEgresso() {
    const emptyEgresso: Egresso = {
        idEgresso: undefined,
        nome: '',
        email: '',
        descricao: '',
        cursos: []
    };
    const emptyEgressoRequest: SalvarEgressoRequest = {
        idEgresso: undefined,
        nome: '',
        email: '',
        descricao: '',
        idCurso: undefined,
        anoInicioCurso: undefined,
        anoFimCurso: undefined
    };
    const emptyCursoEgresso: CursoEgresso = {
        idCurso: undefined,
        anoInicio: undefined,
        anoFim: undefined
    }
    const [egressos, setEgressos] = useState<Egresso[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [egresso, setEgresso] = useState<Egresso>(emptyEgresso);
    const [salvarEgressoRequest, setSalvarEgresso] = useState<SalvarEgressoRequest>(emptyEgressoRequest);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Egresso[]>>(null);
    //DIALOG
    const [egressoDialog, setEgressoDialog] = useState<boolean>(false);
    const [updateDialog, setUpdateDialog] = useState<boolean>(false);
    const [egressoSelecionadoId, setEgressoSelecionadoId] = useState<number>(0);
    const [deleteEgressoDialog, setDeleteEgressoDialog] = useState<boolean>(false);
    const [vincularACursoDialog, setVincularACursoDialog] = useState<boolean>(false);
    const [cursoEgresso, setCursoEgresso] = useState<CursoEgresso>(emptyCursoEgresso);
    const [deleteEgressoId, setDeleteEgressoId] = useState<number>(0);

    useEffect(() => {
        //busca inicial
        egressoService.getEgressos().then((data) => setEgressos(data.dado));
        cursoService.getCursos().then((data) => setCursos(data.dado));
    }, []);

    const modalSalvarEgresso = () => {
        setSalvarEgresso(emptyEgressoRequest);
        setEgressoDialog(true);
    };

    const hideDialog = () => {
        setEgressoDialog(false);
    };

    const saveEgresso = async () => {
        try {
            const response = await egressoService.saveEgresso(salvarEgressoRequest); // aguarda resposta
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso salvo com sucesso!', life: 3000 });

            // atualiza egressos
            const updatedEgressos = await egressoService.getEgressos();
            setEgressos(updatedEgressos.dado);

            setEgressoDialog(false);
            setSalvarEgresso(emptyEgressoRequest);
        } catch (error: any) {
            console.error("Erro ao salvar o egresso:", error);

            // verifica se veio array ou string
            const errorDetails = Array.isArray(error?.response?.detalhes)
                ? error.response.detalhes.join(', ')
                : error?.response?.detalhes || "Erro desconhecido";

            toast.current?.show({ severity: 'error', summary: 'Erro', detail: `Não foi possível salvar o egresso. \nMotivo: ${errorDetails}`, life: 3000 });
        }
    };

    const updateEgresso = async () => {
        try {
            const response = await egressoService.updateEgresso(egressoSelecionadoId, egresso);
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso atualizado com sucesso!', life: 3000 });
            
            //atualiza lista de egressos
            const updatedEgressos = await egressoService.getEgressos();
            setEgressos(updatedEgressos.dado);

            setUpdateDialog(false);
            setEgresso(emptyEgresso);
        } catch (error: any) {
            console.error("Erro ao salvar o egresso:", error);

            // verifica se veio array ou string
            const errorDetails = Array.isArray(error?.response?.data.detalhes)
                ? error.response.data.detalhes.join(', ')
                : error?.response?.data.detalhes || "Erro desconhecido";

            toast.current?.show({ severity: 'error', summary: 'Erro', detail: `Não foi possível salvar o egresso. \nMotivo: ${errorDetails}`, life: 3000 });
        }
    }
    const modalAdicionarCursoAEgresso = (egresso: Egresso) => {
        setEgresso(egresso);
        setEgressoSelecionadoId(egresso.idEgresso!);
        setCursoEgresso(emptyCursoEgresso);
        setVincularACursoDialog(true);
    }

    const modalUpdateEgresso = (egresso: Egresso) => {
        setEgressoSelecionadoId(egresso.idEgresso!);
        setEgresso(egresso);
        setUpdateDialog(true);
    };

    const confirmarDeleteEgresso = (egresso: Egresso) => {
        setDeleteEgressoId(egresso.idEgresso!);
        setDeleteEgressoDialog(true);
    };
    const hideUpdateDialog = () => {
        setUpdateDialog(false);
    }
    const hideDeleteDialog = () => {
        setDeleteEgressoDialog(false);
    }
    const hideVincularACursoDialog = () => {
        setVincularACursoDialog(false);
    }
    const saveEgressoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveEgresso} />
        </React.Fragment>
    );
    const updateEgressoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideUpdateDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={updateEgresso} />
        </React.Fragment>
    )
    const deleteEgresso = (id: number) => {
        setDeleteEgressoDialog(false);
        egressoService.deleteEgresso(id);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso Deletado', life: 3000 });
    };
    const vincularACurso = async (idEgresso: number, cursoEgresso: CursoEgresso) => {
        try {
            const response = await egressoService.vincularACurso(idEgresso, cursoEgresso);
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso vinculado com sucesso!', life: 3000 });

            // atualiza lista de egressos
            const updatedEgressos = await egressoService.getEgressos();
            setEgressos(updatedEgressos.dado);

            setVincularACursoDialog(false);
            setCursoEgresso(emptyCursoEgresso);
        } catch (error: any) {
            console.error("Erro ao vincular o egresso:", error);
            const errorDetails = Array.isArray(error?.response?.detalhes)
                ? error.response.detalhes.join(', ')
                : error?.response?.detalhes || "Erro desconhecido";
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: `Não foi possível salvar o egresso. \nMotivo: ${errorDetails}`, life: 3000 });
        }
    };

    const deleteEgressoDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={() => deleteEgresso(deleteEgressoId)} />
        </React.Fragment>
    );
    const vincularACursoDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideVincularACursoDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={() => vincularACurso(egressoSelecionadoId, cursoEgresso)} />
        </React.Fragment>
    );


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" onClick={modalSalvarEgresso} />
                <Button label="Deletar" icon="pi pi-trash" severity="danger" disabled={true} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gerenciar Egressos</h4>
            <IconField iconPosition="left" className="ml-200">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." onInput={(e) => setGlobalFilter(e.currentTarget.value)} />
            </IconField>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card" style={{ width: "70%", margin: "0 auto", marginTop: "50px" }}>
                <div className="table" style={{ width: "100%", justifyContent: "center" }}>
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={egressos}
                        dataKey="idEgresso" paginator rows={10} globalFilter={globalFilter} header={header}>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="email" header="E-mail" sortable></Column>
                        <Column
                            field="cursos"
                            header="Curso(s)"
                            body={(rowData: Egresso) => rowData.cursos.map(curso => curso.nome).join(", ") || "Não informado"}
                            sortable
                        ></Column>
                        <Column body={(rowData: Egresso) => (
                            <div className="flex gap-2">
                                <Button icon="pi pi-plus-circle" rounded outlined severity="success" onClick={() => modalAdicionarCursoAEgresso(rowData)} />
                                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => modalUpdateEgresso(rowData)} />
                                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarDeleteEgresso(rowData)} />
                            </div>
                        )} exportable={false}></Column>
                    </DataTable>
                </div>

                <Dialog visible={egressoDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Egresso" modal className="p-fluid" footer={saveEgressoDialogFooter} onHide={hideDialog}>
                    <div>
                        <label htmlFor="nome" className="font-bold block mb-2">Nome</label>
                        <InputText id="nome" value={salvarEgressoRequest.nome} keyfilter={/^[a-zA-Z\s]*$/} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, nome: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="email" className="font-bold block mb-2">E-mail</label>
                        <InputText id="email" value={salvarEgressoRequest.email} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, email: e.target.value })} />
                    </div>
                    <div className="field">
                        <label htmlFor="descricao" className="font-bold">Descricao</label>
                        <InputTextarea id="descricao" value={salvarEgressoRequest.descricao} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, descricao: e.target.value })} required rows={3} cols={20} />
                    </div>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <b style={{ fontSize: '0.8rem' }}>Redes Sociais</b>
                        </div>
                    </Divider>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex-auto">
                            <label htmlFor="linkedin" className="font-bold">Linkedin</label>
                            <InputText id="linkedin" value={salvarEgressoRequest.linkedin} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, linkedin: e.target.value })} />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor='instagram' className='font-bold'>Instagram</label>
                            <InputText value={salvarEgressoRequest.instagram} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, instagram: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="curriculo" className="font-bold block mb-2">Curriculo</label>
                        <InputText id="curriculo" value={salvarEgressoRequest.curriculo} onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, curriculo: e.target.value })} />
                    </div>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <b style={{ fontSize: '0.8rem' }}>Curso</b>
                        </div>
                    </Divider>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div>
                            <label htmlFor="cursoId" className="font-bold text-lg">Curso</label>
                            <Dropdown
                                editable
                                showClear
                                id="cursoId"
                                value={cursos.find(curso => curso.idCurso === salvarEgressoRequest.idCurso) || null}
                                onChange={(e) => setSalvarEgresso({
                                    ...salvarEgressoRequest,
                                    idCurso: e.value ? e.value.idCurso : null // se e.value for null, limpa o ID
                                })}
                                options={cursos}
                                optionLabel="nome"
                                placeholder="Selecione um curso"
                                className="w-full"
                            />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor='anoInicio' className='font-bold'>Ano Início</label>
                            <InputNumber id='anoInicio' value={salvarEgressoRequest.anoInicioCurso} inputId="withoutgrouping" onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, anoInicioCurso: e.value })} />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor='anoFim' className='font-bold'>Ano Fim</label>
                            <InputNumber id='anoFim' value={salvarEgressoRequest.anoFimCurso} inputId="withoutgrouping" onChange={(e) => setSalvarEgresso({ ...salvarEgressoRequest, anoFimCurso: e.value })} />
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={deleteEgressoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteEgressoDialogFooter} onHide={hideDeleteDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {egresso && (
                            <span>
                                Tem certeza que deseja deletar <b>{egresso.nome}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
                <Dialog visible={updateDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Egresso" modal className="p-fluid" footer={updateEgressoDialogFooter} onHide={hideUpdateDialog}>
                    <div>
                        <label htmlFor="nome" className="font-bold block mb-2">Nome</label>
                        <InputText id="nome" value={egresso.nome} onChange={(e) => setEgresso({ ...egresso, nome: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="email" className="font-bold block mb-2">E-mail</label>
                        <InputText id="email" value={egresso.email} onChange={(e) => setEgresso({ ...egresso, email: e.target.value })} />
                    </div>
                    <div className="field">
                        <label htmlFor="descricao" className="font-bold">Descricao</label>
                        <InputTextarea id="descricao" value={egresso.descricao} onChange={(e) => setEgresso({ ...egresso, descricao: e.target.value })} required rows={3} cols={20} />
                    </div>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <b style={{ fontSize: '0.8rem' }}>Redes Sociais</b>
                        </div>
                    </Divider>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex-auto">
                            <label htmlFor="linkedin" className="font-bold">Linkedin</label>
                            <InputText id="linkedin" value={egresso.linkedin} onChange={(e) => setEgresso({ ...egresso, linkedin: e.target.value })} />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor='instagram' className='font-bold'>Instagram</label>
                            <InputText value={egresso.instagram} onChange={(e) => setEgresso({ ...egresso, instagram: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="curriculo" className="font-bold block mb-2">Curriculo</label>
                        <InputText id="curriculo" value={egresso.curriculo} onChange={(e) => setEgresso({ ...egresso, curriculo: e.target.value })} />
                    </div>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <b style={{ fontSize: '0.8rem' }}>Curso(s)</b>
                        </div>
                    </Divider>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {egresso.cursos.map((curso, index) => (
                            <div key={index} className="flex flex-wrap gap-3 mb-4">
                                <div className="flex-auto">
                                    <label htmlFor={`cursoId-${index}`} className="font-bold">Curso Id</label>
                                    <InputNumber disabled
                                        id={`cursoId-${index}`}
                                        value={curso.idCurso}
                                        onChange={(e) => {
                                            const updatedCursos = [...egresso.cursos];
                                            updatedCursos[index].idCurso = e.value;
                                            setEgresso({ ...egresso, cursos: updatedCursos });
                                        }}
                                    />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor={`cursoNome-${index}`} className="font-bold">Nome do Curso</label>
                                    <InputText disabled
                                        id={`cursoNome-${index}`}
                                        value={curso.nome}
                                        onChange={(e) => {
                                            const updatedCursos = [...egresso.cursos];
                                            updatedCursos[index].nome = e.target.value;
                                            setEgresso({ ...egresso, cursos: updatedCursos });
                                        }}
                                    />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor={`cursoTipoNivel-${index}`} className="font-bold">Tipo de Nível</label>
                                    <InputText disabled
                                        id={`cursoTipoNivel-${index}`}
                                        value={curso.tipoNivel}
                                        onChange={(e) => {
                                            const updatedCursos = [...egresso.cursos];
                                            updatedCursos[index].tipoNivel = e.target.value;
                                            setEgresso({ ...egresso, cursos: updatedCursos });
                                        }}
                                    />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor={`cursoCoordenador-${index}`} className="font-bold">Coordenador</label>
                                    <InputText disabled
                                        id={`cursoCoordenador-${index}`}
                                        value={curso.coordenador || ''}
                                        onChange={(e) => {
                                            const updatedCursos = [...egresso.cursos];
                                            updatedCursos[index].coordenador.nome = e.target.value || "Sem coordenador";
                                            setEgresso({ ...egresso, cursos: updatedCursos });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Dialog>
                <Dialog
                    visible={vincularACursoDialog}
                    style={{ width: '40rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header={`Vincular ${egresso.nome} a Curso`}
                    modal
                    footer={vincularACursoDialogFooter}
                    onHide={hideVincularACursoDialog}
                >
                    <div className="space-y-4">
                        {/* Seção de Curso */}
                        <div>
                            <label htmlFor="cursoId" className="font-bold text-lg">Curso</label>
                            <Dropdown
                                editable
                                showClear
                                id="cursoId"
                                value={cursos.find(curso => curso.idCurso === cursoEgresso.idCurso) || null}
                                onChange={(e) => setCursoEgresso({
                                    ...cursoEgresso,
                                    idCurso: e.value ? e.value.idCurso : null // Se e.value for null, limpa o ID
                                })}
                                options={cursos}
                                optionLabel="nome"
                                placeholder="Selecione um curso"
                                className="w-full"
                            />
                        </div>

                        {/* Seção de Ano Início e Ano Fim */}
                        <div className="flex gap-4 w-[100%]">
                            <div className="flex-1">
                                <label htmlFor="anoInicio" className="font-bold">Ano Início</label>
                                <InputNumber
                                    id="anoInicio"
                                    value={cursoEgresso.anoInicio}
                                    inputId="withoutgrouping"
                                    onChange={(e) => setCursoEgresso({ ...cursoEgresso, anoInicio: e.value })}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex-1 w-[10%]">
                                <label htmlFor="anoFim" className="font-bold">Ano Fim</label>
                                <InputNumber
                                    id="anoFim"
                                    value={cursoEgresso.anoFim}
                                    inputId="withoutgrouping"
                                    onChange={(e) => setCursoEgresso({ ...cursoEgresso, anoFim: e.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>

    );
}