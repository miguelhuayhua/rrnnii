'use client';
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import Footer from "./static/Footer";
import Image from 'next/legacy/image';
import Link from 'next/link'
import { Negrita, Normal, Titulo } from "./componentes/Textos";
import { BotonOutline } from "./componentes/Botones";
import Actividad from "./componentes/items/Actividad";
import Evento from "./componentes/items/Evento";
import { BsEye, BsWhatsapp } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
const Cliente = () => {
    const [y, setY] = useState(0);
    const onScroll = useCallback(() => {
        const { scrollY } = window;
        setY(scrollY)
    }, []);
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);
    return (
        <>
            <Box display='flex' px={{ xs: 0, md: 5, lg: 20, }} height={{ xs: 600, md: 700, lg: 800 }} position='relative' overflow={'hidden'} >
                <Box width="50%" sx={{ opacity: 1 - y * 0.0015, top: y * 0.1 }} position='relative'>
                    <Image alt="fondo monolito" layout="fill" src='/monolito.png' objectFit="fill" className="monolito" style={{ transform: `perspective(500px) rotateX(${y * 0.5}deg) rotateY(25deg)` }} />
                    <Box px={{ xs: 2, xl: 16 }} py={{ xs: 10, sm: 10, md: 20 }} >
                        <Typography component='h1' textAlign='center' color={'#212b36'} fontSize={{ xs: 18, sm: 25, md: 30, lg: 40 }} fontWeight={800}  >
                            Relaciones Internacionales
                            <br />
                            <span className="upea">
                                UPEA
                            </span>
                        </Typography>
                        <Typography component='p' textAlign='center' fontSize={14}>
                            Descubre los convenios y ofertas disponibles para la comunidad universitaria
                        </Typography>
                        <Stack direction='row' spacing={2} justifyContent='center' my={4}>
                            <Link href='/convenios'>
                                <Button
                                    sx={{ background: '#212b36', fontSize: 14, px: 2, borderRadius: 3, color: 'white', textTransform: 'none', fontWeight: 700, "&:hover": { background: '#212b36dd' } }}>
                                    <BsEye style={{ marginRight: 10, fontSize: 20 }} />
                                    Ver convenios
                                </Button></Link>
                        </Stack>
                    </Box>
                </Box>
                <Box width="50%" height={"100%"} position={'relative'} className="imagen-container" sx={{ opacity: 1 - y * 0.0015 }}>
                    <Box className='imagen' ></Box>
                </Box>
                <div className="dec-right first"></div>
                <div className="dec-right second"></div>
                <div className="dec-right third"></div>
                <div className="dec-left first"></div>
                <div className="dec-left second"></div>
                <div className="dec-left third"></div>
            </Box>
            <Box bgcolor='#fdfdfe' position='relative' >
                <Negrita sx={{ textAlign: 'center', py: 2 }}>
                    rrnnii.upea.bo
                </Negrita>
                <Titulo sx={{ textAlign: 'center' }} variant="h3">Próximos eventos</Titulo>
                <Grid container spacing={2} px={{ xs: 1, sm: 10, md: 1, lg: 5, xl: 20 }} py={4}>
                    <Grid item xs={6} md={3} >
                        <Evento />
                    </Grid>
                    <Grid item xs={6} md={3} >
                        <Evento />
                    </Grid>
                </Grid>
                <Titulo textAlign='center' variant="h3">
                    Últimas actividades
                </Titulo>
                <Grid container spacing={2} px={{ xs: 1, sm: 10, md: 1, lg: 5, xl: 20 }} py={4}>
                    <Grid item xs={6} md={3} >
                        <Actividad></Actividad>
                    </Grid>
                    <Grid item xs={6} md={3} >
                        <Actividad></Actividad>
                    </Grid>
                </Grid>
            </Box>
            <Grid container bgcolor='#fdfdfe' px={2}>
                <Grid item xs={6} position='relative' px={{ xs: 2, md: 5, lg: 10 }}>
                    <Image width={100} height={80} src='/revista.png' layout='responsive' />
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
                    <BotonOutline startIcon={<CiSearch />}>
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
                    <BotonOutline startIcon={<CiSearch />} sx={{ float: 'right' }}>
                        Explorar Idiomas
                    </BotonOutline>
                </Grid>
                <Grid item xs={6} position='relative' px={{ xs: 2, md: 5, lg: 10 }} pt={5}>
                    <Image width={100} height={60} src='/gorro.png' layout='responsive' />
                </Grid>
            </Grid>
            <Box position='relative' style={{ transform: 'rotateZ(180deg)' }}>
                <div className="dec-right first"></div>
                <div className="dec-right second"></div>
                <div className="dec-right third"></div>
                <div className="dec-left first"></div>
                <div className="dec-left second"></div>
                <div className="dec-left third"></div>
            </Box>
            <Box py={10}>
                <Titulo sx={{ textAlign: 'center', fontSize: { xs: 14, md: 18 }, py: 2 }}>
                    ¿Tienes dudas?
                </Titulo>
                <Button startIcon={<BsWhatsapp style={{ fontSize: 20 }} />}
                    sx={{ display: 'flex', mx: 'auto', background: '#212b36', fontSize: 14, px: 2, borderRadius: 3, color: 'white', textTransform: 'none', fontWeight: 700, "&:hover": { background: '#212b36dd' } }}
                >
                    Contactanos
                </Button>
            </Box>
            <Footer />
        </>
    )
}
export default Cliente;