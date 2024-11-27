"use client";
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs, CircularProgress } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Beca } from "@prisma/client";
import { Icon } from '@iconify/react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import xlsx from 'json-as-xlsx';
import { red } from "@mui/material/colors";
import axios from "axios";
import ModalBeca from "./ModalBeca";
import { ChipBox } from "@/app/componentes/Mostrar";
import BecaComponent from "../componentes/items/Beca";
import { IoSearch } from "react-icons/io5";
import { Button, Input, InputGroup } from "rsuite";
import { paises } from "@/utils/globals";
import { pdf } from "@react-pdf/renderer";
import BecaPDF from "./Pdf";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [becas, setBecas] = useState<Beca[]>([]);
    const [prevBecas, setPrevBecas] = useState<Beca[]>([]);
    const [beca, setBeca] = useState<any>(null);
    const router = useRouter();
    const [load, setLoad] = useState(true);
    useEffect(() => {
        axios.post('/api/beca/todo', {}).then(res => {
            setBecas(res.data);
            setPrevBecas(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ my: 2 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/becas">
                    <Normal>Becas</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Becas
            </Titulo>
            <Stack direction='row' my={2} spacing={1} >
                <Button appearance="primary"
                    onClick={() => router.push('/dashboard/becas/crear')}>
                    Añadir beca
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/beca/todo', {}).then(res => {
                            setBecas(res.data);
                            setPrevBecas(res.data);
                            setOpcion('todo');
                            setLoad(false);
                        });
                    }}>
                    <Icon icon='nrk:reload' fontSize={22} />
                </Button>
                <Button appearance='subtle'
                    onClick={() => {
                        let data = [
                            {
                                sheet: "Hoja 1",
                                columns: [
                                    { label: "ID", value: "id" },
                                    { label: "Título", value: (row: any) => row.titulo },
                                    { label: "Descripción Corta", value: (row: any) => row.descripcionCorta },
                                    { label: "Estado de la Beca", value: (row: any) => row.estado ? "Activo" : "Inactivo" },
                                    { label: "Tipo de Beca", value: (row: any) => "Beca " + row.tipo },
                                    { label: "País", value: (row: any) => paises.find(pais => pais.value === row.pais)?.pais || "Desconocido" },
                                    { label: "Continente", value: (row: any) => row.continente || "No especificado" },
                                    { label: "Fecha de Expiración", value: (row: any) => row.termina },
                                    { label: "Encargado", value: (row: any) => row.encargado || "Sin encargado" },
                                    { label: "Número de Participantes", value: (row: any) => row.Participantes.length },
                                    { label: "Institución", value: (row: any) => row.Institucion?.nombre || "Sin institución" },
                                    { label: "Conteo", value: (row: any) => row.conteo },
                                    { label: "Enlace", value: (row: any) => `https://rrnnii.upea.bo/becas/${row.id}` },
                                ],
                                content: becas
                            }
                        ]
                        let settings = {
                            fileName: "listado-de-becas" + dayjs().format('DD/MM/YYYY - HH:mm:ss'), // Name of the resulting spreadsheet
                            writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                        }
                        xlsx(data as any, settings);
                    }}
                >
                    <Icon icon='fa-regular:file-excel' fontSize={22} />
                </Button>
                <Button appearance='subtle'
                    onClick={() => {
                        pdf(<BecaPDF
                            Becas={becas as any}
                            modo={opcion}
                        />).toBlob().then(res => {
                            let url = URL.createObjectURL(res);
                            let a = document.createElement('a');
                            a.download = "listado-becas" + dayjs().format('DD/MM/YYYY - HH:mm:ss');
                            a.href = url;
                            a.click();
                            a.remove();
                        });
                    }}
                >
                    <Icon icon='fa-regular:file-pdf' fontSize={22} />
                </Button>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, boxShadow: '2px 2px 8px #21212122' }}
                TabIndicatorProps={{ sx: { bgcolor: red[600] } }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => {
                    setOpcion(value);
                    if (value == 'todo')
                        setBecas(prevBecas);
                    else if (value == 'vigente')
                        setBecas(prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setBecas(prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setBecas(prevBecas.filter(value => value.estado))
                    else if (value == 'inactivo')
                        setBecas(prevBecas.filter(value => !value.estado))
                }} >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevBecas.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar becas"
                    onChange={text => {
                        setBecas(prevBecas.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                    }} />
                <InputGroup.Addon style={{ background: 'white' }}>
                    <IoSearch fontSize={28} />
                </InputGroup.Addon>
            </InputGroup>
            {
                load ?
                    <CircularProgress color="inherit"
                        sx={{
                            display: 'block', mt: 3,
                            justifyContent: 'center',
                            mx: 'auto'
                        }} /> : <Grid container spacing={2}>
                        {
                            becas.map(value => (
                                <Grid key={value.id} item xs={12} lg={6}>
                                    <BecaComponent
                                        setBeca={setBeca}
                                        setBecas={setBecas}
                                        setOpcion={setOpcion}
                                        setPrevBecas={setPrevBecas}
                                        Beca={value as any} />
                                </Grid>
                            ))
                        }
                    </Grid>
            }

            {
                beca ?
                    <ModalBeca
                        Beca={beca}
                        setBeca={setBeca}
                        setBecas={setBecas}
                        setPrevBecas={setPrevBecas}
                    />
                    : null
            }


        </Box>
    )
}