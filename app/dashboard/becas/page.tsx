"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Beca } from "@prisma/client";
import Image from 'next/legacy/image';
import { FaAngleLeft, FaAngleRight, FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { InputBox, SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { RiFileWord2Line } from "react-icons/ri";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import ModalBeca from "./ModalBeca";
import { ChipBox } from "@/app/componentes/Mostrar";
import BecaComponent from "../componentes/items/Beca";
import { IoSearch } from "react-icons/io5";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [becas, setBecas] = useState<Beca[]>([]);
    const [prevBecas, setPrevBecas] = useState<Beca[]>([]);
    const { openSnackbar } = useSnackbar();
    const [beca, setBeca] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/beca/todo', {}).then(res => {
            setBecas(res.data);
            setPrevBecas(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/becas">
                    <Normal>Becas</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Becas
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/becas/crear')}>
                    Añadir beca
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/beca/todo', {}).then(res => {
                        setBecas(res.data);
                        setPrevBecas(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
                TabIndicatorProps={{ sx: { bgcolor: blue[500] } }}
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
                        setBecas(prevBecas);
                    else if (value == 'vigente')
                        setBecas(prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setBecas(prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setBecas(prevBecas.filter(value => value.estado))
                    else if (value == 'inactivo')
                        setBecas(prevBecas.filter(value => !value.estado))
                }} >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevBecas.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevBecas.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <InputBox
                onChange={ev => {
                    setBecas(prevBecas.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                }}
                placeholder="Buscar" InputProps={{
                    endAdornment: <IoSearch fontSize={28} />
                }} sx={{ maxWidth: 300 }} />
            <Grid container spacing={2}>
                {
                    becas.map(value => (
                        <Grid key={value.id} item xs={12} lg={6}>
                            <BecaComponent
                                setBeca={setBeca}
                                setBecas={setBecas}
                                setOpcion={setOpcion}
                                setPrevBecas={setPrevBecas}
                                Beca={value as any} />
                        </Grid>
                    ))
                }
            </Grid>
            {
                beca ?
                    <ModalBeca
                        Beca={beca}
                        setBeca={setBeca}
                        setBecas={setBecas}
                        setPrevBecas={setPrevBecas}
                    />
                    : null
            }


        </Box>
    )
}