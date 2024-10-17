"use client";
import { BotonFilled, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Noticia } from "@prisma/client";
import ModalNoticia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { blue } from "@mui/material/colors";
import { InputBox } from "@/app/componentes/Datos";
import axios from "axios";
import { ChipBox } from "@/app/componentes/Mostrar";
import { IoSearch } from "react-icons/io5";
import NoticiaComponent from "../componentes/items/Noticia";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [prevNoticias, setPrevNoticias] = useState<Noticia[]>([]);
    const [noticia, setNoticia] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/noticia/todo').then(res => {
            setNoticias(res.data);
            setPrevNoticias(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} pb={2}>
            <Breadcrumbs >
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
                <BotonFilled onClick={() => router.push('/dashboard/noticias/crear')}>
                    Añadir noticia
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/noticia/todo', { opcion }).then(res => {
                        setNoticias(res.data);
                        setPrevNoticias(res.data);
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
            <InputBox
                onChange={ev => {
                    setNoticias(prevNoticias.filter(value => value.titulo.toLowerCase().includes(ev.target.value.toLowerCase())))
                }}
                placeholder="Buscar" InputProps={{
                    endAdornment: <IoSearch fontSize={28} />
                }} sx={{ maxWidth: 300 }} />
            <Grid container spacing={2}>
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