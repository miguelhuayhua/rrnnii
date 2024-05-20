"use client";
import Image from 'next/legacy/image';
import AppBar from '@mui/material/AppBar';
import { Button, Tooltip, useScrollTrigger, Typography, Grid, Stack, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { FaAngleDown } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { GoDotFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { BotonSimple } from '../componentes/Botones';
import { Negrita, Normal } from '../componentes/Textos';
//estilos


const Navbar = () => {
    const pathname = usePathname();
    const trigger = useScrollTrigger({
        threshold: 0,
        disableHysteresis: true
    });
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
            <AppBar
                position="sticky"
                sx={{
                    boxShadow: trigger ? 'rgba(135, 158, 171, 0.16) 0px 8px 16px 0px' : 'none',
                    zIndex: 1001,
                    bgcolor: trigger ? '#f3f4f6' : '#f4f6f8',
                    transition: 'background .25s',

                }}
            >
                {
                    y > 0 ?
                        <LinearProgress sx={{ ".MuiLinearProgress-bar": { background: 'linear-gradient(274deg, rgba(195,31,31,1) 0%, rgba(0,78,235,1) 100%)' }, height: 3, background: '#f3f4f6' }} variant='determinate' value={y / (window as any).scrollMaxY * 100} />
                        : null
                }
                <Container
                    maxWidth={'lg'}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: trigger ? 1.2 : 1.8,
                        transition: 'padding .25s'
                    }}
                >
                    <Link href={"/"} style={{ textDecoration: 'none' }}>
                        <Box display='flex' alignItems='center'>
                            <Image
                                width={50}
                                height={45}
                                layout='fixed'
                                src={"/logorrnnii.png"}
                                alt='logo de UAYUA'
                            />
                            <Box px={0.5} display='flex' flexDirection='column' alignItems='start'>
                                <Normal sx={{ fontSize: 11, textAlign: 'start' }}>
                                    Relaciones  Internacionales
                                </Normal>
                                <Negrita sx={{ color: '#666' }}>
                                    Universidad Pública de El Alto
                                </Negrita>
                            </Box>
                        </Box>
                    </Link>
                    <Box display='flex' alignItems='center'>
                        <Link href={''}>
                            <Typography sx={{ color: pathname == '/' ? '#c5080c' : '#2f3842', fontSize: 13, mr: 3 }}>
                                {pathname == '/' ? <GoDotFill color='inherit' /> : null}
                                Principal
                            </Typography>
                        </Link>
                        <Stack direction='row' spacing={2} mr={2}>
                            <Tooltip
                                PopperProps={{
                                    sx: {
                                        "& .MuiTooltip-tooltip": {
                                            background: 'linear-gradient(50deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(255,255,255,1) 60%, rgba(255,240,240,1) 100%)',
                                            borderRadius: 3,
                                            maxWidth: 750,
                                            width: "80vw",
                                            p: 3,
                                            boxShadow: '-10px 10px 30px #00000022',
                                            ".MuiTooltip-arrow": {
                                                color: 'white'
                                            },
                                        }
                                    }
                                }}
                                placement='bottom'
                                enterTouchDelay={0}
                                leaveTouchDelay={0}
                                title={
                                    <Grid container columnSpacing={3} >
                                        <Grid item xs={2}>
                                            <Link href={'/convenios'}>
                                                <Typography color='black'>
                                                    Convenios
                                                </Typography>
                                            </Link>
                                            <Link href={'/convenios?tipo=nacionales'}>
                                                <Typography sx={{ color: '#586773', fontSize: 13, my: 1 }}>
                                                    Nacionales
                                                </Typography>
                                            </Link>
                                            <Link href={'/convenios?tipo=internacionales'}>
                                                <Typography sx={{ color: '#586773', fontSize: 13, my: 1 }}>
                                                    Internacionales
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/pasantias'}>
                                                <Typography color='black'>
                                                    Pasantías
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/actividades'}>
                                                <Typography color='black'>
                                                    Actividades
                                                </Typography>
                                            </Link>
                                            <Link href={'/actividades?tipo=beca'}>
                                                <Typography sx={{ color: '#586773', fontSize: 13, my: 1 }}>
                                                    Becas
                                                </Typography>
                                            </Link>
                                            <Link href={'/actividades?tipo=idioma'}>
                                                <Typography sx={{ color: '#586773', fontSize: 13, my: 1 }}>
                                                    Idiomas
                                                </Typography>
                                            </Link>
                                            <Link href={'/actividades?tipo=noticia'}>
                                                <Typography sx={{ color: '#586773', fontSize: 13, my: 1 }}>
                                                    Noticias
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/eventos'}>
                                                <Typography color='black'>
                                                    Eventos
                                                </Typography>
                                            </Link>

                                        </Grid>
                                        <Grid item xs={4} mt={2} position='relative'>
                                            <Image src='/upea-border.png' style={{ filter: 'brightness(.7)' }} layout="responsive" width={100} height={100} objectFit="contain" />
                                        </Grid>
                                    </Grid>
                                }
                            >
                                <Link href={''}>
                                    <Typography sx={{ color: '#2f3842', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                                        Convocatorias <FaAngleDown />
                                    </Typography>
                                </Link>
                            </Tooltip>
                            <Link href={''}>
                                <Typography sx={{ color: '#2f3842', fontSize: 13 }}>
                                    {pathname == '/galeria' ? <GoDotFill color='inherit' /> : null}
                                    Galería
                                </Typography>
                            </Link>
                            <Link href={''}>
                                <Typography sx={{ color: '#2f3842', fontSize: 13 }}>
                                    Sobre Nosotros
                                </Typography>
                            </Link>
                        </Stack>
                        <BotonSimple>
                            <FaUser fontSize={20} />
                        </BotonSimple>
                    </Box>
                </Container>
            </AppBar >

        </>
    )
}


export default Navbar;
