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
import { Galeria } from "@prisma/client";
import ModalGaleria from "./Modal";
import { RiEditFill } from "react-icons/ri";
import { IoReload } from "react-icons/io5";
import GaleriaComponent from "../componentes/items/Galeria";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [galerias, setGalerias] = useState<Galeria[]>([]);
    const [galeria, setGaleria] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/galeria/todo', { opcion }).then(res => {
            setGalerias(res.data);
        })
    }, [opcion, galeria]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Galeria
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/galeria">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/galeria">
                    <Normal>Galeria</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/galeria/crear')}>
                    Añadir galeria
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
                {galerias.map(value => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} position='relative'>
                        <GaleriaComponent Galeria={value} />
                        <BotonFilled
                            onClick={() => {
                                setGaleria(value);
                            }}
                            sx={{ position: 'absolute', bottom: 35, left: 42, zIndex: 20, borderRadius: "50%" }} >
                            <RiEditFill fontSize={20} />
                        </BotonFilled>
                    </Grid>
                ))}
            </Grid>
            {
                galeria ?
                    <ModalGaleria
                        Galeria={galeria}
                        setGaleria={setGaleria}
                    />
                    : null
            }
        </Box>
    )
}