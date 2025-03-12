import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Egresso } from '../types/Egresso';
import { egressoService } from "../services/EgressoService";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from 'primereact/tooltip';


export default function Home() {
  const emptyEgresso: Egresso = {
    idEgresso: undefined,
    nome: '',
    email: '',
    descricao: '',
    cursos: []
  };

  const [egressos, setEgressos] = useState<Egresso[]>([]);
  const [egressoSelecionado, setEgressoSelecionado] = useState<Egresso>(emptyEgresso);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [visualizarDialog, setVisualizarDialog] = useState<boolean>(false);
  const dt = useRef<DataTable<Egresso[]>>(null);

  useEffect(() => {
    egressoService.getEgressos().then((data) => {
      const shuffledEgressos = shuffle(data.dado);
      setEgressos(shuffledEgressos);
    });
  }, []);

  // Função para embaralhar os egressos
  const shuffle = (array: Egresso[]): Egresso[] => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const modalVisualizarEgresso = (egresso: Egresso) => {
    setEgressoSelecionado(egresso);
    console.log(egressoSelecionado);
    setVisualizarDialog(true);
  };

  const hideVisualizarDialog = () => {
    setVisualizarDialog(false);
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Visualizar Egressos</h4>
      <IconField iconPosition="left" className="ml-200">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => setGlobalFilter(e.currentTarget.value)} />
      </IconField>
    </div>
  );

  return (
    <div className="card" style={{ width: "70%", margin: "0 auto", marginTop: "50px" }}>
      <div className="table" style={{ width: "100%", justifyContent: "center" }}>
        <DataTable ref={dt} value={egressos}
          dataKey="idEgresso" paginator rows={10} globalFilter={globalFilter} header={header}>
          <Column field="nome" header="Nome" sortable></Column>
          <Column field="email" header="E-mail" sortable></Column>
          <Column
            field="cursos"
            header="Curso(s)"
            body={(rowData: Egresso) => rowData.cursos?.map(curso => curso.nome).join(", ") || "Não informado"}
            sortable
          ></Column>
          <Column body={(rowData: Egresso) => (
            <div className="flex gap-2">
              <Tooltip target=".icone-visualizar" style={{ fontSize: '12px', maxWidth: '200px' }} />
              <Button icon="pi pi-eye" rounded outlined className="icone-visualizar mr-2" onClick={() => modalVisualizarEgresso(rowData)} data-pr-tooltip="Visualizar Informações" data-pr-position="top"/>
              <Tooltip target=".icone-linkedin" style={{ fontSize: '12px', maxWidth: '200px' }} />
              <Button icon="pi pi-linkedin" className="icone-linkedin" data-pr-tooltip="Link do Linkedin" data-pr-position="top" rounded outlined severity="success" disabled={!rowData.linkedin} onClick={() => rowData.linkedin && window.open(rowData.linkedin, "_blank")} />
              <Tooltip target=".icone-insta" style={{ fontSize: '12px', maxWidth: '200px' }}/>
              <Button icon="pi pi-instagram" className="icone-insta" data-pr-tooltip="Link do Instagram" data-pr-position="top" rounded outlined severity="danger" disabled={!rowData.instagram} onClick={() => {
                if (rowData.instagram) {
                  window.open(rowData.instagram, "_blank"); // Abre o link do Instagram em nova aba
                }
              }} />
            </div>
          )} exportable={false}></Column>
        </DataTable>
      </div>
      <Dialog visible={visualizarDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Egresso" modal className="p-fluid" onHide={hideVisualizarDialog}>
        <div>
          <label htmlFor="nome" className="font-bold block mb-2">Nome</label>
          <InputText id="nome" value={egressoSelecionado?.nome} disabled />
        </div>
        <div>
          <label htmlFor="email" className="font-bold block mb-2">E-mail</label>
          <InputText id="email" value={egressoSelecionado.email} disabled />
        </div>
        <div className="field">
          <label htmlFor="descricao" className="font-bold">Descrição</label>
          <InputTextarea id="descricao" value={egressoSelecionado.descricao} disabled required rows={3} cols={20} />
        </div>

        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b style={{ fontSize: '0.8rem' }}>Redes Sociais</b>
          </div>
        </Divider>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-auto">
            <label htmlFor="linkedin" className="font-bold">Linkedin</label>
            <InputText id="linkedin" value={egressoSelecionado.linkedin} disabled />
          </div>
          <div className="flex-auto">
            <label htmlFor='instagram' className='font-bold'>Instagram</label>
            <InputText value={egressoSelecionado.instagram} disabled />
          </div>
        </div>
        <div>
          <label htmlFor="curriculo" className="font-bold block mb-2">Currículo</label>
          <InputText id="curriculo" value={egressoSelecionado.curriculo} disabled />
        </div>

        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b style={{ fontSize: '0.8rem' }}>Curso(s)</b>
          </div>
        </Divider>
        <div className="flex flex-wrap gap-3 mb-4">
          {egressoSelecionado.cursos?.map((curso, index) => (
            <div key={index} className="flex flex-wrap gap-3 mb-4">
              <div className="flex-auto">
                <label htmlFor={`cursoId-${index}`} className="font-bold">Curso Id</label>
                <InputNumber disabled id={`cursoId-${index}`} value={curso.idCurso} />
              </div>
              <div className="flex-auto">
                <label htmlFor={`cursoNome-${index}`} className="font-bold">Nome do Curso</label>
                <InputText disabled id={`cursoNome-${index}`} value={curso.nome} />
              </div>
              <div className="flex-auto">
                <label htmlFor={`cursoTipoNivel-${index}`} className="font-bold">Tipo de Nível</label>
                <InputText disabled id={`cursoTipoNivel-${index}`} value={curso.tipoNivel} />
              </div>
              <div className="flex-auto">
                <label htmlFor={`cursoCoordenador-${index}`} className="font-bold">Coordenador</label>
                <InputText disabled id={`cursoCoordenador-${index}`} value={curso.coordenador || ''} />
              </div>
            </div>
          ))}
        </div>

        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b style={{ fontSize: '0.8rem' }}>Depoimentos</b>
          </div>
        </Divider>
        <div className="flex flex-wrap gap-3 mb-4">
          {egressoSelecionado.depoimentos?.map((depoimento, index) => {
            const dataFormatada = depoimento.data
              ? new Date(depoimento.data).toLocaleDateString('pt-BR')
              : "Data desconhecida";
            return (
              <div key={index} className="w-full">
                <label className="font-bold block mb-2">Depoimento {dataFormatada}</label>
                <InputTextarea
                  disabled
                  value={depoimento.texto}
                  rows={3}
                  cols={30}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  )
}