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
import { Pasantia } from "@prisma/client";
import { RiEditFill } from "react-icons/ri";
import PasantiaComponent from "../componentes/items/Pasantia";
import ModalPasantia from "./Modal";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<Pasantia[]>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/pasantia/todo', { opcion }).then(res => {
            setPasantias(res.data);
        })
    }, [opcion, Pasantia]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Pasantias
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/pasantias">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/Pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/pasantias/crear')}>
                    Añadir Pasantia
                </BotonFilled>
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
                {Pasantias.map(value => (
                    <Grid item xs={12} md={6} lg={4} xl={3} position='relative'>
                        <PasantiaComponent Pasantia={value} />
                        <BotonFilled
                            onClick={() => {
                                setPasantia(value);
                            }}
                            sx={{ position: 'absolute', bottom: 10, left: 30 }} >
                            <RiEditFill fontSize={18} />
                        </BotonFilled>
                    </Grid>
                ))}
            </Grid>
            {
                Pasantia ?
                    <ModalPasantia
                        Pasantia={Pasantia}
                        setPasantia={setPasantia}
                    />
                    : null
            }
        </Box>
    )
}