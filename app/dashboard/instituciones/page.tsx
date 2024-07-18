'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Institucion } from "@prisma/client";
import ModalInstitucion from "./Modal";
import { RiEditFill } from "react-icons/ri";
import { BoxSombra } from "@/app/componentes/Mostrar";
import { InputBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import dayjs from "dayjs";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [prevInstituciones, setPrevInstituciones] = useState<any>([]);
    const [institucion, setInstitucion] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/institucion/todo', { opcion }).then(res => {
            setInstituciones(res.data);
            setPrevInstituciones(res.data);
        })
    }, [opcion, institucion]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonOutline onClick={() => router.back()}>
                <MdArrowLeft fontSize={20} /> Volver
            </BotonOutline>
            <Titulo sx={{ fontSize: 20, mt: 1 }}>
                Instituciones
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/instituciones">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/instituciones">
                    <Normal>Instituciones</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/instituciones/crear')}>
                    Añadir institución
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
                            setInstituciones(filtrarValorEnArray(prevInstituciones, ev.target.value));
                        }}
                        InputProps={{
                            startAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                </Grid>
                {instituciones.map((value) => (
                    <Grid key={value.id} item xs={6} sm={4} md={3} lg={2} position='relative'>
                        <BoxSombra p={2} pb={7} sx={{ bgcolor: '#fefefe', borderRadius: 3 }}>
                            <Titulo sx={{ fontSize: { xs: 11, md: 15 }, fontWeight: 600 }}>
                                {value.nombre}
                            </Titulo>
                            <Normal sx={{ fontSize: 10, fontWeight: 600 }}>
                                Creado el: {dayjs(value.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
                            </Normal>
                            <Avatar variant="circular" src={value.logo} sx={{ position: 'absolute', bottom: 5, right: 10 }}>
                            </Avatar>
                        </BoxSombra>
                        <BotonOutline
                            onClick={() => {
                                setInstitucion(value);
                            }}
                            sx={{ position: 'absolute', bottom: 10, left: 30 }} >
                            <RiEditFill fontSize={18} />
                        </BotonOutline>
                    </Grid>
                ))}
            </Grid>
            {
                institucion ?
                    <ModalInstitucion
                        Institucion={institucion}
                        setInstitucion={setInstitucion}
                    />
                    : null
            }
        </Box>
    )
}