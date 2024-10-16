'use client';
import { Box, Divider, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import Footer from "./static/Footer";
import Link from 'next/link';
import CountUp from 'react-countup';
import { Negrita, Normal, Titulo } from "./componentes/Textos";
import { BotonOutline, BotonFilled, BotonSimple } from "./componentes/Botones";
import EventoItem from "./componentes/items/Evento";
import { BsWhatsapp } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { blueGrey, grey } from "@mui/material/colors";
import { Gradient } from '@/utils/Gradient.ts'
import { ChipBox } from "./componentes/Mostrar";
import { FaAngleRight } from "react-icons/fa";
import axios from "axios";
import { Evento, Noticia } from "@prisma/client";
import Imagen from 'next/legacy/image';
import { MdPhone } from "react-icons/md";
import { useRouter } from "next/navigation";
import { fileDomain } from "@/utils/globals";
const Cliente = () => {
    const theme = useTheme();
    const downsm = useMediaQuery(theme.breakpoints.down('md'));
    const [y, setY] = useState(0);
    const router = useRouter();
    const [Eventos, setEventos] = useState<Evento[]>([]);
    const [Noticias, setNoticias] = useState<Noticia[]>([]);
    const onScroll = useCallback(() => {
        const { scrollY } = window;
        setY(scrollY)
    }, []);
    const [count, setCount] = useState({
        sizen: 0, sizee: 0, sizec: 0, sizeb: 0
    });
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        var gradient = new Gradient() as any;
        gradient.initGradient('#gradient-canvas');
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);

    useEffect(() => {
        axios.post('/api/evento/todo', { take: 4 }).then(res => {
            setEventos(res.data);
        });
        axios.post('/api/noticia/listar', { skip: 0, orden: '0' }).then(res => {
            setNoticias(res.data.map((value: Noticia) => ({ ...value, imagen: fileDomain + value.imagen })));
        });
        axios.post('/api/count').then(res => {
            setCount(res.data)
        })
    }, []);
    return (
        <>
            <canvas id="gradient-canvas" style={{ width: "100vw", height: downsm ? 400 : 500, position: 'absolute', top: 0, clipPath: 'polygon(100% 0, 100% 18%, 0 100%, 0 0)' }}></canvas >
            <Grid container>
                <Grid item sx={{ opacity: 1 - y * 0.0015, top: y * 0.1, zIndex: 20, }} xs={12} sm={7} pt={{ xs: 5, md: 0 }}>
                    <Box mt={6} pl={{ xs: 5, sm: 1, md: 10, xl: 35 }} pr={{ xs: 5, sm: 1, md: 2 }} >
                        <ChipBox label='Encargada de: ' sx={{ mb: 2, background: '#00000055', fontWeight: 700, fontSize: 14, color: 'white', borderRadius: 5, py: 2 }} />
                        <Titulo variant='h1' sx={{ color: blueGrey[50], fontSize: { xs: 16, sm: 20, md: 25, lg: 30 }, background: '#00000055', backdropFilter: 'blur(6px)', p: 2, borderRadius: 3 }} >
                            Unidad de Relaciones Internacionales
                            <br />
                            <span className="upea" style={{ fontSize: "1.9em", marginTop: 2 }} >
                                UNIVERSIDAD PÚBLICA DE EL ALTO
                            </span>
                        </Titulo>
                        <Normal sx={{ fontSize: 17, pt: 14 }}>
                            Descubre los convenios y ofertas disponibles para toda la comunidad universitaria, no olvides que puedes
                            pasar a nuestra oficinas para mayor información.
                        </Normal>
                        <Stack direction='row' spacing={2} justifyContent='center' my={4}>
                            <Link style={{ textDecoration: 'none' }} href='/convenios'>
                                <BotonFilled sx={{ height: 40 }} endIcon={<FaAngleRight />}>
                                    Ver convenios
                                </BotonFilled>
                            </Link>
                            <Link href='/convenios'>
                                <BotonSimple endIcon={<MdPhone />}>
                                    Contactarnos
                                </BotonSimple>
                            </Link>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4.5} display={{ xs: 'none', sm: 'block' }} px={{ xs: 1, md: 4, lg: 10, xl: 14 }} zIndex={20} >
                    <Box sx={{
                        overflow: 'hidden',
                        maxHeight: 650,
                        height: 400,
                        transform: 'perspective(100px) rotateY(-3deg) rotateZ(3deg)',
                        backdropFilter: 'blur(4px)',
                        bgcolor: '#ffffff11',
                        px: 1
                    }} >
                        <Box className="slide-up" sx={{ opacity: 0.95 }}>
                            <Grid container spacing={1}>
                                {
                                    Noticias.map(value => (

                                        <Grid key={value.id} item xs={6}>
                                            <Imagen
                                                objectFit="cover"
                                                style={{ borderRadius: 10 }}
                                                src={value.imagen} width={100} height={100} layout="responsive" />
                                        </Grid>

                                    ))
                                }
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: "100%",
                    justifyContent: 'space-evenly',
                    my: 3
                }}
            >
                <CountUp start={0} duration={10} end={count.sizec} >
                    {({ countUpRef }) => (
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            fontSize: 35
                        }}>
                            <span style={{
                                fontSize: 'inherit',
                                marginRight: 10, fontWeight: 700
                            }} ref={countUpRef} />
                            <span style={{ fontSize: 15 }}>
                                Convenios
                            </span>
                        </Box>
                    )}
                </CountUp>
                <Box sx={{ height: 35, width: "1px", bgcolor: '#888' }} />
                <CountUp start={0} duration={10} end={count.sizeb} >
                    {({ countUpRef }) => (
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            fontSize: 35
                        }}>
                            <span style={{
                                fontSize: 'inherit',
                                marginRight: 10,
                                fontWeight: 700
                            }} ref={countUpRef} />
                            <span style={{ fontSize: 15 }}>
                                Becas
                            </span>
                        </Box>
                    )}
                </CountUp>
                <Box sx={{ height: 35, width: "1px", bgcolor: '#888' }} />
                <CountUp start={0} duration={10} end={count.sizen} >
                    {({ countUpRef }) => (
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            fontSize: 35
                        }}>
                            <span style={{
                                fontSize: 'inherit',
                                marginRight: 10,
                                fontWeight: 700
                            }} ref={countUpRef} />
                            <span style={{ fontSize: 15 }}>
                                Noticias
                            </span>
                        </Box>
                    )}
                </CountUp>
            </Box>
            <Box position='relative'>
                <Negrita sx={{ textAlign: 'center', py: 2 }}>
                    rrnnii.upea.bo
                </Negrita>
                <Titulo sx={{ textAlign: 'center' }} variant="h3">Próximos eventos</Titulo>
                <Grid container spacing={2} px={{ xs: 1, sm: 10, md: 1, lg: 5, xl: 20 }} py={4}>
                    {
                        Eventos.map(value => (
                            <Grid item xs={6} md={3} key={value.id}>
                                <EventoItem value={value} />
                            </Grid>))
                    }
                </Grid>

            </Box>
            <Grid container bgcolor='#fff' px={2} py={5} borderTop={`1px solid ${grey[400]}`}>
                <Grid item xs={6} position='relative' px={{ xs: 2, md: 5, lg: 10 }}>
                    <Imagen width={100} height={80} src='/revista.png' layout='responsive' />
                </Grid>
                <Grid item xs={6}>
                    <Negrita>
                        EXPLORA LO QUE TE CONVENGA
                    </Negrita>
                    <Titulo variant='h2' sx={{ py: 2 }}>
                        Busca las oportunidades
                    </Titulo>
                    <Normal sx={{ pb: 3 }}>
                        Hemos recolectado la información necesaria para que puedas estar al tanto con las convocatorias que te puede ofrecer la Universidad Pública de El Alto
                    </Normal>
                    <BotonOutline onClick={() => {
                        router.push('/actividades?t=becas')
                    }} startIcon={<CiSearch />}>
                        Explorar Becas
                    </BotonOutline>
                </Grid>
                <Grid item xs={6}>
                    <Negrita textAlign='end'>
                        CONOCE EL MUNDO
                    </Negrita>
                    <Titulo sx={{ textAlign: 'end', py: 2 }} variant='h2'>
                        Aprende idiomas y ábrete al mundo
                    </Titulo>
                    <Normal sx={{ textAlign: 'end', pb: 3 }}>
                        Hemos recolectado la información necesaria para que puedas estar al tanto con las convocatorias que te puede ofrecer la Universidad Pública de El Alto
                    </Normal>
                    <BotonOutline onClick={() => {
                        router.push('/actividades?t=idiomas')
                    }} startIcon={<CiSearch />} sx={{ float: 'right' }}>
                        Explorar Idiomas
                    </BotonOutline>
                </Grid>
                <Grid item xs={6} position='relative' px={{ xs: 2, md: 5, lg: 10 }} pt={5}>
                    <Imagen width={100} height={60} src='/gorro.png' layout='responsive' />
                </Grid>
            </Grid>
            <Box py={10}>
                <Titulo sx={{ textAlign: 'center', fontSize: { xs: 14, md: 18 }, py: 2 }}>
                    ¿Tienes dudas?
                </Titulo>
                <BotonFilled sx={{ display: 'flex', mx: 'auto' }} startIcon={<BsWhatsapp style={{ fontSize: 20 }} />}>
                    Contactanos
                </BotonFilled>
            </Box>
            <Footer />
        </>
    )
}
export default Cliente;