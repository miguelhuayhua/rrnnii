"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Actividad } from "@prisma/client";
import ModalActividad from "./Modal";
import { IoReload } from "react-icons/io5";
import { InputBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [prevActividades, setPrevActividades] = useState<any>([]);
    const [actividad, setActividad] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/actividad/todo', { opcion }).then(res => {
            setActividades(res.data);
            setPrevActividades(res.data);
        })
    }, [opcion, actividad]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
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
                sx={{ mb: 4 }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => { setOpcion(value) }} >
                <TabBox label="Todos" value='todo' sx={{ ml: 2 }} />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Tabla data={actividades} />
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