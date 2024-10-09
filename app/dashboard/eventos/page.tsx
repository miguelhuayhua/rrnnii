"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Evento } from "@prisma/client";
import ModalEvento from "./Modal";
import { RiFileWord2Line } from "react-icons/ri";
import Image from 'next/legacy/image';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { InputBox, SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { IoSearch } from "react-icons/io5";
import EventoComponent from "../componentes/items/Evento";
import { ChipBox } from "@/app/componentes/Mostrar";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [prevEventos, setPrevEventos] = useState<Evento[]>([]);
    const [evento, setEvento] = useState<any>(null);
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/evento/todo').then(res => {
            setEventos(res.data);
            setPrevEventos(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/eventos">
                    <Normal>Eventos</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Eventos
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/eventos/crear')}>
                    Añadir evento
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/evento/todo', { opcion }).then(res => {
                        setEventos(res.data);
                        setPrevEventos(res.data);
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
                        setEventos(prevEventos);
                    else if (value == 'vigente')
                        setEventos(prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setEventos(prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setEventos(prevEventos.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setEventos(prevEventos.filter(value => !value.estado));
                }}  >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevEventos.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevEventos.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevEventos.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <InputBox
                onChange={ev => {
                    setEventos(prevEventos.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                }}
                placeholder="Buscar" InputProps={{
                    endAdornment: <IoSearch fontSize={28} />
                }} sx={{ maxWidth: 300 }} />
            <Grid container spacing={2}>
                {
                    eventos.map(value => (
                        <Grid key={value.id} item xs={12} lg={6}>
                            <EventoComponent
                                setEvento={setEvento}
                                setEventos={setEventos}
                                setOpcion={setOpcion}
                                setPrevEventos={setPrevEventos}
                                Evento={value as any} />
                        </Grid>
                    ))
                }
            </Grid>
            {
                evento ?
                    <ModalEvento
                        Evento={evento}
                        setEvento={setEvento}
                        setEventos={setEventos}
                        setPrevEventos={setPrevEventos}
                    />
                    : null
            }
        </Box>
    )
}