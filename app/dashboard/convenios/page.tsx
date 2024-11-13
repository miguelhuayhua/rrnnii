'use client';
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, CircularProgress, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Convenio, Institucion } from "@prisma/client";
import ModalConvenio from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import axios from "axios";
import { ChipBox } from "@/app/componentes/Mostrar";
import ConvenioComponent from "../componentes/items/Convenio";
import { IoSearch } from "react-icons/io5";
import { Button, Input, InputGroup } from "rsuite";
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [convenios, setConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const [convenio, setConvenio] = useState<any>(null);
    const [prevConvenios, setPrevConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const [load, setLoad] = useState(true);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/convenio/todo', {}).then(res => {
            setConvenios(res.data);
            setPrevConvenios(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ mb: 1, mt: 2 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/convenios">
                    <Normal>Convenios</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo>
                Convenios
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <Button size='lg' appearance="primary"
                    onClick={() => router.push('/dashboard/convenios/crear')}>
                    Añadir convenio
                </Button>
                <Button
                    size='lg'
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/convenio/todo', {}).then(res => {
                            setConvenios(res.data);
                            setPrevConvenios(res.data);
                            setOpcion('todo');
                            setLoad(false);
                        });
                    }}>
                    <TbReload fontSize={22} />
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
                        setConvenios(prevConvenios);
                    else if (value == 'vigente')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setConvenios(prevConvenios.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setConvenios(prevConvenios.filter(value => !value.estado));
                }} >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevConvenios.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Vigentes
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0).length} />
                    </Box>} value='vigente' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Concluídos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0).length} />
                    </Box>} value='concluido' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevConvenios.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevConvenios.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar convenios"
                    onChange={text => {
                        setConvenios(prevConvenios.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                    }} />
                <InputGroup.Addon style={{ background: 'transparent' }}>
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
                            convenios.length > 0 ?

                                convenios.map(value => (
                                    <Grid key={value.id} item xs={12} lg={6}>
                                        <ConvenioComponent
                                            setConvenio={setConvenio}
                                            setConvenios={setConvenios}
                                            setOpcion={setOpcion}
                                            setPrevConvenios={setPrevConvenios}
                                            Convenio={value as any} />
                                    </Grid>
                                )) :
                                <Grid item xs={12}>
                                    <Normal sx={{ textAlign: 'center' }}>Convenios no encontrados</Normal>
                                </Grid>
                        }
                    </Grid>
            }

            {
                convenio ?
                    <ModalConvenio
                        Convenio={convenio}
                        setConvenio={setConvenio}
                        setConvenios={setConvenios}
                        setPrevConvenios={setPrevConvenios}
                        setOpcion={setOpcion}
                    />
                    : null
            }
        </Box>
    )
}