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
import { Convenio } from "@prisma/client";
import ModalConvenio from "./Modal";
import ConvenioComponent from "../componentes/items/Convenio";
import { RiEditFill } from "react-icons/ri";
import { InputBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [convenios, setConvenios] = useState<any>([]);
    const [convenio, setConvenio] = useState<any>(null);
    const [prevConvenios, setPrevConvenios] = useState<any>([]);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/convenio/todo', { opcion }).then(res => {
            setConvenios(res.data);
            setPrevConvenios(res.data);
        })
    }, [opcion, convenio]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Convenios
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/convenios">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/convenios">
                    <Normal>Convenios</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/convenios/crear')}>
                    Añadir convenio
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
                        textTransform: 'none'
                    }
                }}
                value={opcion}
                onChange={(_, value) => { setOpcion(value) }} >
                <TabBox label="Todos" value='todo' sx={{ ml: 2 }} />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <InputBox sx={{ width: 200 }} placeholder='Buscar'
                        onChange={(ev) => {
                            setConvenios(filtrarValorEnArray(prevConvenios, ev.target.value));
                        }}
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                </Grid>
                {convenios.map((value: any) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} position='relative'>
                        <ConvenioComponent Convenio={value as any} />
                        <BotonFilled
                            onClick={() => {
                                setConvenio(value);
                            }}
                            sx={{ position: 'absolute', bottom: 10, left: 30 }} >
                            <RiEditFill fontSize={18} />
                        </BotonFilled>
                    </Grid>
                ))}
            </Grid>
            {
                convenio ?
                    <ModalConvenio
                        Convenio={convenio}
                        setConvenio={setConvenio}
                    />
                    : null
            }
        </Box>
    )
}