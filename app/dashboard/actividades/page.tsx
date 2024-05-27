'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { BoxSombra, TabBox } from "../componentes/Mostrar";
import Tabla from "../componentes/Tabla";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Actividad } from "@prisma/client";
import ModalActividad from "./Modal";
import { RiEditFill } from "react-icons/ri";
import ActividadComponent from "../componentes/items/Actividad";
import { IoReload } from "react-icons/io5";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [actividad, setActividad] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/actividad/todo', { opcion }).then(res => {
            setActividades(res.data);
        })
    }, [opcion, actividad]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Actividades
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/actividades">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/actividades">
                    <Normal>Actividades</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/actividades/crear')}>
                    Añadir actividad
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
                {actividades.map(value => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} position='relative'>
                        <ActividadComponent Actividad={value} />
                        <BotonFilled
                            onClick={() => {
                                setActividad(value);
                            }}
                            sx={{ position: 'absolute', bottom: 10, left: 30 }} >
                            <RiEditFill fontSize={18} />
                        </BotonFilled>
                    </Grid>
                ))}
            </Grid>
            {
                actividad ?
                    <ModalActividad
                        Actividad={actividad}
                        setActividad={setActividad}
                    />
                    : null
            }
        </Box>
    )
}