"use client";
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs, CircularProgress } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Evento } from "@prisma/client";
import ModalEvento from "./Modal";
import { Icon } from '@iconify/react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import { red } from "@mui/material/colors";
import axios from "axios";
import { IoSearch } from "react-icons/io5";
import EventoComponent from "../componentes/items/Evento";
import { ChipBox } from "@/app/componentes/Mostrar";
import 'dayjs/locale/es';
import { Button, Input, InputGroup } from "rsuite";
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [prevEventos, setPrevEventos] = useState<Evento[]>([]);
    const [evento, setEvento] = useState<any>(null);
    const router = useRouter();
    const [load, setLoad] = useState(true);
    useEffect(() => {
        axios.post('/api/evento/todo').then(res => {
            setEventos(res.data);
            setPrevEventos(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ my: 2 }}>
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
            <Stack direction='row' my={2} spacing={1} >
                <Button appearance="primary"
                    onClick={() => router.push('/dashboard/evento/crear')}>
                    Añadir evento
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/evento/todo', { opcion }).then(res => {
                            setEventos(res.data);
                            setPrevEventos(res.data);
                            setOpcion('todo');
                            setLoad(false);
                        });
                    }}>
                    <Icon icon='nrk:reload' fontSize={22} />
                </Button>
                <Button appearance='subtle'>
                    <Icon icon='fa-regular:file-excel' fontSize={22} />
                </Button>
                <Button appearance='subtle'>
                    <Icon icon='fa-regular:file-pdf' fontSize={22} />
                </Button>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, boxShadow: '2px 2px 8px #21212122' }}
                TabIndicatorProps={{ sx: { bgcolor: red[700] } }}
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
            <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar eventos"
                    onChange={text => {
                        setEventos(prevEventos.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
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
            }

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