"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Institucion, Pasantia } from "@prisma/client";
import ModalPasantia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import 'dayjs/locale/es';
dayjs.locale('es');
import { blue, red } from "@mui/material/colors";
import axios from "axios";
import PasantiaComponent from "../componentes/items/Pasantia";
import { ChipBox } from "@/app/componentes/Mostrar";
import { InputBox } from "@/app/componentes/Datos";
import { IoSearch } from "react-icons/io5";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [prevPasantias, setPrevPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/pasantia/todo').then(res => {
            setPasantias(res.data);
            setPrevPasantias(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs sx={{ mb: 1 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mb: 2 }}>
                Pasantías
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/pasantias/crear')}>
                    Añadir Pasantia
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/pasantia/todo', { opcion }).then(res => {
                        setPasantias(res.data);
                        setPrevPasantias(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
                TabIndicatorProps={{ sx: { bgcolor: blue[700] } }}
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
                        setPasantias(prevPasantias);
                    else if (value == 'vigente')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0))
                    else if (value == 'activo')
                        setPasantias(prevPasantias.filter(value => value.estado))
                    else if (value == 'concluido')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0))
                    else if (value == 'inactivo')
                        setPasantias(prevPasantias.filter(value => !value.estado))
                }}>
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevPasantias.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <InputBox
                onChange={ev => {
                    setPasantias(prevPasantias.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                }}
                placeholder="Buscar" InputProps={{
                    endAdornment: <IoSearch fontSize={28} />
                }} sx={{ maxWidth: 300 }} />
            <Grid container spacing={2}>
                {
                    Pasantias.map(value => (
                        <Grid item xs={12} lg={6}>
                            <PasantiaComponent
                                setPasantia={setPasantia}
                                setPasantias={setPasantias}
                                setOpcion={setOpcion}
                                setPrevPasantias={setPrevPasantias}
                                Pasantia={value as any} />
                        </Grid>
                    ))
                }
            </Grid>
            {
                Pasantia ?
                    <ModalPasantia
                        Pasantia={Pasantia}
                        setPasantia={setPasantia}
                        setPasantias={setPasantias}
                        setPrevPasantias={setPrevPasantias}
                    />
                    : null
            }
        </Box>
    )
}