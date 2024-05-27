'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Evento } from "@prisma/client";
import ModalEvento from "./Modal";
import { RiEditFill } from "react-icons/ri";
import { IoReload } from "react-icons/io5";
import EventoComponent from "../componentes/items/Evento";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [evento, setEvento] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/evento/todo', { opcion }).then(res => {
            setEventos(res.data);
        })
    }, [opcion, evento]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Eventos
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/eventos">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/eventos">
                    <Normal>Eventos</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/eventos/crear')}>
                    Añadir evento
                </BotonFilled>
                <BotonOutline onClick={() => router.refresh()}>
                    <IoReload fontSize={18} />
                </BotonOutline>
            </Stack>
            <Tabs
                sx={{
                    minHeight: 0,
                    ".Mui-selected": {
                        color: '#bc3c3b !important'
                    },
                    ".MuiTabs-indicator": {
                        background: '#bc3c3b',
                        textTransform: 'none',
                    }
                }}
                value={opcion}
                onChange={(_, value) => { setOpcion(value) }} >
                <TabBox label="Todos" value='todo' sx={{ ml: 2 }} />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Grid container spacing={2} mt={1}>
                {eventos.map(value => (
                    <Grid item xs={12} md={6} lg={4} xl={3} position='relative'>
                        <EventoComponent Evento={value} />
                        <BotonFilled
                            onClick={() => {
                                setEvento(value);
                            }}
                            sx={{ position: 'absolute', bottom: 30, left: 25 }} >
                            <RiEditFill fontSize={18} />
                        </BotonFilled>
                    </Grid>
                ))}
            </Grid>
            {
                evento ?
                    <ModalEvento
                        Evento={evento}
                        setEvento={setEvento}
                    />
                    : null
            }
        </Box>
    )
}