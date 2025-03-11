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
import { InputTextarea } from 'primereact/inputtextarea';
import { egressoService } from '../../services/EgressoService';

interface Egresso {
  id: string | null;
  nome: string;
  email: string;
  descricao: string,
  curso: string;
}

export default function GerenciarEgresso() {
    const emptyEgresso: Egresso = {
       id: null,
       nome: '',
       email: '',
       descricao: '',
       curso: ''
    };

    const [egressos, setEgressos] = useState<Egresso[]>([]);
    const [egressoDialog, setEgressoDialog] = useState<boolean>(false);
    const [deleteEgressoDialog, setDeleteEgressoDialog] = useState<boolean>(false);
    const [egresso, setEgresso] = useState<Egresso>(emptyEgresso);
    const [selectedEgressos, setSelectedEgressos] = useState<Egresso[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Egresso[]>>(null);

    useEffect(() => {
        // Simulando uma busca inicial (substitua pelo serviço real)
        setEgressos([
            { id: '1', nome: 'João Silva', email: 'joao@email.com', descricao: 'Descrição do João', curso: 'Engenharia' },
            { id: '2', nome: 'Maria Souza', email: 'maria@email.com', descricao: 'Descrição da Maria', curso: 'Computação' }
        ]);
    }, []);

    const modalSalvarEgresso = () => {
        setEgresso(emptyEgresso);
        setSubmitted(false);
        setEgressoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEgressoDialog(false);
    };

    const saveEgresso = () => {
        setSubmitted(true);

        if (egresso.nome.trim()) {
            let _egressos = [...egressos];
            let _egresso = { ...egresso };

            if (egresso.id) {
                const index = findIndexById(egresso.id);
                _egressos[index] = _egresso;
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso Atualizado', life: 3000 });
            } else {
                _egresso.id = createId();
                _egressos.push(_egresso);
                egressoService.saveEgresso(egresso);
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso Criado', life: 3000 });
            }

            setEgressos(_egressos);
            setEgressoDialog(false);
            setEgresso(emptyEgresso);
        }
    };

    const editEgresso = (egresso: Egresso) => {
        setEgresso({ ...egresso });
        setEgressoDialog(true);
    };

    const confirmDeleteEgresso = (egresso: Egresso) => {
        setEgresso(egresso);
        setDeleteEgressoDialog(true);
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveEgresso} />
        </React.Fragment>
    );

    const deleteEgresso = () => {
        let _egressos = egressos.filter((val) => val.id !== egresso.id);
        setEgressos(_egressos);
        setDeleteEgressoDialog(false);
        setEgresso(emptyEgresso);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Egresso Deletado', life: 3000 });
    };

    const findIndexById = (id: string) => {
        return egressos.findIndex(e => e.id === id);
    };

    const createId = (): string => {
        return Math.random().toString(36).substr(2, 5);
    };


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" onClick={modalSalvarEgresso} />
                <Button label="Deletar" icon="pi pi-trash" severity="danger" disabled={!selectedEgressos.length} />
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

                    <DataTable ref={dt} value={egressos} selection={selectedEgressos} 
                            onSelectionChange={(e) => setSelectedEgressos(e.value as Egresso[])}
                            dataKey="id" paginator rows={10} globalFilter={globalFilter} header={header}
                            selectionMode="multiple">
                        <Column selectionMode="multiple"></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column field="email" header="E-mail" sortable></Column>
                        <Column field="curso" header="Curso" sortable></Column>
                        <Column body={(rowData: Egresso) => (
                            <div className="flex gap-2">
                                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEgresso(rowData)} />
                                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteEgresso(rowData)} />
                            </div>
                        )} exportable={false}></Column>
                    </DataTable>
                </div>

                <Dialog visible={egressoDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Egresso" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
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
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex-auto">
                            <label>Curso</label>
                            <InputText value={egresso.curso} onChange={(e) => setEgresso({ ...egresso, curso: e.target.value })} />
                        </div>
                        <div className="flex-auto">
                            <label>Curso</label>
                            <InputText value={egresso.curso} onChange={(e) => setEgresso({ ...egresso, curso: e.target.value })} />
                        </div>
                    </div>
                
                </Dialog>
            </div>
        </div>

    );
}