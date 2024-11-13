"use client";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs, CircularProgress } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Noticia } from "@prisma/client";
import ModalNoticia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import axios from "axios";
import { ChipBox } from "@/app/componentes/Mostrar";
import { IoSearch } from "react-icons/io5";
import NoticiaComponent from "../componentes/items/Noticia";
import { Button, Input, InputGroup } from "rsuite";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [prevNoticias, setPrevNoticias] = useState<Noticia[]>([]);
    const [noticia, setNoticia] = useState<any>(null);
    const [load, setLoad] = useState(true);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/noticia/todo').then(res => {
            setNoticias(res.data);
            setPrevNoticias(res.data);
            setLoad(false);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs sx={{ my: 2 }}>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/noticias">
                    <Normal>Noticias</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Noticias
            </Titulo>
            <Stack direction='row' my={2} spacing={2} >
                <Button size='lg' appearance="primary"
                    onClick={() => router.push('/dashboard/noticias/crear')}>
                    Añadir noticia
                </Button>
                <Button
                    size='lg'
                    appearance="subtle"
                    onClick={() => {
                        setLoad(true);
                        axios.post('/api/noticia/todo', { opcion }).then(res => {
                            setNoticias(res.data);
                            setPrevNoticias(res.data);
                            setOpcion('todo');
                            setLoad(false);
                        });
                    }}>
                    <TbReload fontSize={22} />
                </Button>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, boxShadow: '2px 2px 8px #21212122' }}
                TabIndicatorProps={{ sx: { bgcolor: red[700] } }}
                ScrollButtonComponent={(props) =>
                    <Button
                        size='lg'
                        appearance="subtle"  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </Button>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => {
                    setOpcion(value);
                    if (value == 'todo')
                        setNoticias(prevNoticias);
                    else if (value == 'activo')
                        setNoticias(prevNoticias.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setNoticias(prevNoticias.filter(value => !value.estado));
                }}  >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevNoticias.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevNoticias.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevNoticias.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />

            </Tabs>

            <InputGroup style={{ maxWidth: 300, marginBottom: 20 }} >
                <Input style={{ fontFamily: 'inherit' }}
                    placeholder="Buscar noticias"
                    onChange={text => {
                        setNoticias(prevNoticias.filter(value => value.titulo.toLowerCase().includes(text.toLowerCase())))
                    }} />
                <InputGroup.Addon style={{ background: 'white' }}>
                    <IoSearch fontSize={28} />
                </InputGroup.Addon>
            </InputGroup>

            {
                load ? <CircularProgress color="inherit"
                    sx={{
                        display: 'block', mt: 3,
                        justifyContent: 'center',
                        mx: 'auto'
                    }} />
                    : <Grid container spacing={2}>
                        {
                            noticias.map(value => (
                                <Grid key={value.id} item xs={12} lg={6}>
                                    <NoticiaComponent
                                        setNoticia={setNoticia}
                                        setNoticias={setNoticias}
                                        setOpcion={setOpcion}
                                        setPrevNoticias={setPrevNoticias}
                                        Noticia={value as any} />
                                </Grid>
                            ))
                        }
                    </Grid>
            }

            {
                noticia ?
                    <ModalNoticia
                        Noticia={noticia}
                        setNoticia={setNoticia}
                        setNoticias={setNoticias}
                        setPrevNoticias={setPrevNoticias}
                    />
                    : null
            }
        </Box>
    )
}