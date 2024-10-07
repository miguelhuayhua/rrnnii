'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft, MdEdit } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Galeria } from "@prisma/client";
import ModalGaleria from "./Modal";
import GaleriaComponent from "../componentes/items/Galeria";
import { InputBox, SwitchBox } from "@/app/componentes/Datos";
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { useSnackbar } from "@/providers/SnackbarProvider";
import axios from "axios";
import { blue } from "@mui/material/colors";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [galerias, setGalerias] = useState<Galeria[]>([]);
    const [prevGalerias, setPrevGalerias] = useState<Galeria[]>([]);
    const [galeria, setGaleria] = useState<any>(null);
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    useEffect(() => {
        axios.post('/api/galeria/todo', {}).then(res => {
            setGalerias(res.data);
            setPrevGalerias(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/galeria">
                    <Normal>Galeria</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Galeria
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/galeria/crear')}>
                    Añadir galeria
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/galeria/todo', {}).then(res => {
                        setGalerias(res.data);
                        setPrevGalerias(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 4, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
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
                        setGalerias(prevGalerias);
                    else if (value == 'activo')
                        setGalerias(prevGalerias.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setGalerias(prevGalerias.filter(value => !value.estado));
                }} >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <InputBox size='small'
                        sx={{
                            width: "30%",
                            minWidth: 200,
                            mt: 1
                        }} placeholder='Buscar'
                        onChange={(ev) => {
                            setGalerias(filtrarValorEnArray(prevGalerias, ev.target.value));
                        }}
                        InputProps={{
                            endAdornment:
                                <BiSearch fontSize={25} />
                        }}
                    />
                </Grid>
                {galerias.map((value) => (
                    <Grid key={value.id} item xs={6} sm={6} md={4} lg={3} xl={2} position='relative'>
                        <GaleriaComponent Galeria={value} />
                        <Stack direction='row' bgcolor='white' borderRadius={3} p={0.5} alignItems='center' position='absolute' top={25} right={10} spacing={1} >
                            <BotonOutline
                                onClick={() => {
                                    setGaleria(value);
                                }}>
                                <MdEdit fontSize={18} />
                            </BotonOutline>
                            <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                axios.post('/api/galeria/estado', { estado: checked, id: value.id }).then(res => {
                                    openSnackbar(res.data.mensaje);
                                    axios.post('/api/galeria/todo', { opcion }).then(res => {
                                        setGalerias(res.data);
                                        setPrevGalerias(res.data);
                                        setOpcion('todo');
                                    });
                                });
                            }} />
                        </Stack>
                    </Grid>
                ))}
            </Grid>
            {
                galeria ?
                    <ModalGaleria
                        setGalerias={setGalerias}
                        setPrevGalerias={setPrevGalerias}
                        Galeria={galeria}
                        setGaleria={setGaleria}
                    />
                    : null
            }
        </Box>
    )
}