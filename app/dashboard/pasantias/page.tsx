"use client";
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs, CircularProgress } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Institucion, Pasantia } from "@prisma/client";
import ModalPasantia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');
import { Icon } from '@iconify/react';
import { red } from "@mui/material/colors";
import axios from "axios";
import PasantiaComponent from "../componentes/items/Pasantia";
import { ChipBox } from "@/app/componentes/Mostrar";
import { IoSearch } from "react-icons/io5";
import { Button, Input, InputGroup } from "rsuite";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [prevPasantias, setPrevPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    const router = useRouter();
    const [load, setLoad] = useState(true);
    useEffect(() => {
        axios.post('/api/pasantia/todo').then(res => {
            setPasantias(res.data);
            setPrevPasantias(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ mb: 1, mt: 2 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mb: 2 }}>
                Pasantías
            </Titulo>

            <Stack direction='row' my={2} spacing={1} >
                <Button appearance="primary"
                    onClick={() => router.push('/dashboard/pasantias/crear')}>
                    Añadir pasantia
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/pasantia/todo', { opcion }).then(res => {
                            setPasantias(res.data);
                            setPrevPasantias(res.data);
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
                TabIndicatorProps={{ sx: { bgcolor: red[600] } }}
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
                        setPasantias(prevPasantias);
                    else if (value == 'vigente')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0))
                    else if (value == 'activo')
                        setPasantias(prevPasantias.filter(value => value.estado))
                    else if (value == 'concluido')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0))
                    else if (value == 'inactivo')
                        setPasantias(prevPasantias.filter(value => !value.estado))
                }}>
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevPasantias.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPasantias.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>

            <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                <Input
                    placeholder="Buscar pasantías"
                    style={{ fontFamily: 'inherit' }}
                    onChange={text => {
                        setPasantias(prevPasantias.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
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
                            Pasantias.length > 0 ?

                                Pasantias.map(value => (
                                    <Grid item xs={12} lg={6} key={value.id}>
                                        <PasantiaComponent
                                            setPasantia={setPasantia}
                                            setPasantias={setPasantias}
                                            setOpcion={setOpcion}
                                            setPrevPasantias={setPrevPasantias}
                                            Pasantia={value as any} />
                                    </Grid>
                                ))
                                : <Grid item xs={12}>
                                    <Normal sx={{ textAlign: 'center' }}>
                                        Pasantías no encontradas
                                    </Normal>
                                </Grid>
                        }
                    </Grid>
            }

            {
                Pasantia ?
                    <ModalPasantia
                        Pasantia={Pasantia}
                        setPasantia={setPasantia}
                        setPasantias={setPasantias}
                        setPrevPasantias={setPrevPasantias}
                    />
                    : null
            }
        </Box>
    )
}