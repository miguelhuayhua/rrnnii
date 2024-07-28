"use client";
import Image from 'next/legacy/image';
import AppBar from '@mui/material/AppBar';
import { Tooltip, useScrollTrigger, Typography, Grid, Stack, LinearProgress, Drawer } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { FaAngleDown, FaNewspaper } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { GoDotFill, GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { BotonSimple } from '../componentes/Botones';
import { Negrita, Normal } from '../componentes/Textos';
import { HiOutlineBars3BottomLeft } from 'react-icons/hi2';
import ModalLogin from './ModalLogin';
import { BiDownArrow, BiHome } from 'react-icons/bi';
import { IoPeople } from 'react-icons/io5';
import { PiDotOutlineFill, PiSquaresFourFill } from 'react-icons/pi';
import { grey, red } from '@mui/material/colors';
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
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);
    return (
        <>
            <Box
                sx={{
                    boxShadow: trigger ? 'rgba(135, 158, 171, 0.16) 0px 8px 16px 0px' : 'none',
                    zIndex: 1001,
                    bgcolor: trigger ? 'white' : grey[50],
                    transition: 'background .25s',
                    position: 'sticky',
                    top: 0,
                    left: 0,
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
                    <Link href={"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                <Negrita sx={{ fontSize: 12 }}>
                                    Universidad Pública de El Alto
                                </Negrita>
                            </Box>
                        </Box>
                    </Link>
                    <Box display='flex' alignItems='center'>
                        <Stack display={{ xs: 'none', md: 'flex' }} direction='row' spacing={2} mr={2}>
                            <Link href={'/'}>
                                <Normal sx={{ color: pathname == '/' ? red[700] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/' ? <GoDotFill color='inherit' /> : null}
                                    Principal
                                </Normal>
                            </Link>
                            <Tooltip
                                PopperProps={{
                                    sx: {
                                        "& .MuiTooltip-tooltip": {
                                            background: 'linear-gradient(50deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(255,255,255,1) 60%, rgba(255,240,240,1) 100%)',
                                            borderRadius: 3,
                                            maxWidth: 900,
                                            width: "80vw",
                                            p: 2,
                                            boxShadow: '-10px 10px 30px #00000022',
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
                                                <Negrita>
                                                    Convenios
                                                </Negrita>
                                            </Link>
                                            <Link href={'/convenios?tipo=nacionales'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Nacionales
                                                </Normal>
                                            </Link>
                                            <Link href={'/convenios?tipo=internacionales'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Internacionales
                                                </Normal>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/pasantias'}>
                                                <Negrita>
                                                    Pasantías
                                                </Negrita>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/actividades'}>
                                                <Negrita>
                                                    Actividades
                                                </Negrita>
                                            </Link>
                                            <Link href={'/actividades?tipo=beca'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Becas
                                                </Normal>
                                            </Link>
                                            <Link href={'/actividades?tipo=idioma'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Idiomas
                                                </Normal>
                                            </Link>
                                            <Link href={'/actividades?tipo=noticia'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Noticias
                                                </Normal>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Link href={'/eventos'}>
                                                <Negrita>
                                                    Eventos
                                                </Negrita>
                                            </Link>

                                        </Grid>
                                        <Grid item xs={4} mt={2} position='relative'>
                                            <Image src='/upea-border.png' style={{ filter: 'brightness(.7)' }} layout="responsive" width={100} height={100} objectFit="contain" />
                                        </Grid>
                                    </Grid>
                                }
                            >
                                <Normal sx={{ display: 'flex', alignItems: 'center', color: pathname.includes('/convenios') || pathname.includes('/pasantias') || pathname.includes('/actividades') || pathname.includes('/eventos') ? red[700] : grey[900] }}>
                                    Convocatorias <FaAngleDown />
                                </Normal>
                            </Tooltip>
                            <Link href={'/galeria'}>
                                <Normal sx={{ color: pathname == '/galeria' ? red[700] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/galeria' ? <GoDotFill color='inherit' /> : null}
                                    Galería
                                </Normal>
                            </Link>
                            <Link href={'/about'}>
                                <Normal sx={{ color: pathname == '/about' ? red[700] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/about' ? <GoDotFill color='inherit' /> : null}
                                    Sobre Nosotros
                                </Normal>
                            </Link>
                        </Stack>
                        <BotonSimple onClick={() => {
                            setOpen2(true);
                        }}>
                            <FaUser fontSize={18} />
                        </BotonSimple>

                        <BotonSimple sx={{ height: 40, display: { xs: 'block', md: 'none' } }} onClick={() => {
                            setOpen(true);
                        }}>
                            <HiOutlineBars3BottomLeft fontSize={27} />
                        </BotonSimple>
                    </Box>
                </Container>
            </Box >

            <Drawer open={open} onClose={() => setOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box py={2} width={220}>
                    <Box ml={2}>
                        <Image
                            width={50}
                            height={45}
                            layout='fixed'
                            src={"/logorrnnii.png"}
                            alt='logo de UAYUA'
                        />
                    </Box>
                    <br />
                    <Link href={'/'}>
                        <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/' ? '#883944' : '#666', bgcolor: pathname == '/' ? '#88394411' : 'transparent', fontSize: 14, mt: 1 }} startIcon={<GoHomeFill />} fullWidth>
                            Principal
                        </BotonSimple>
                    </Link>
                    <BotonSimple
                        onClick={() => setOpen3(!open3)}
                        sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == 'f' ? '#883944' : '#666', bgcolor: pathname == '/g' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<FaNewspaper />} fullWidth>
                        Convocatorias <BiDownArrow style={{ position: 'absolute', right: 10, transform: open3 ? 'rotateZ(180deg)' : 'rotateZ(0deg)', transition: 'transform 0.5s' }} />
                    </BotonSimple>
                    <Box display={open3 || pathname.includes('convenios') || pathname.includes('pasantias') || pathname.includes('actividades') || pathname.includes('eventos') ? 'block' : 'none'}>
                        <Link href={'/convenios'}>
                            <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/convenios' ? '#883944' : '#666', bgcolor: pathname == '/convenios' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Convenios
                            </BotonSimple>
                        </Link>
                        <Link href={'/pasantias'}>
                            <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/pasantias' ? '#883944' : '#666', bgcolor: pathname == '/pasantias' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Pasantías
                            </BotonSimple>
                        </Link>
                        <Link href={'/actividades'}>
                            <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/actividades' ? '#883944' : '#666', bgcolor: pathname == '/actividades' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Actividades
                            </BotonSimple>
                        </Link>
                        <Link href={'/eventos'}>
                            <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/eventos' ? '#883944' : '#666', bgcolor: pathname == '/eventos' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Eventos
                            </BotonSimple>
                        </Link>
                    </Box>
                    <Link href={'/galeria'}>
                        <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/galeria' ? '#883944' : '#666', bgcolor: pathname == '/galeria' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<PiSquaresFourFill />} fullWidth>
                            Galeria
                        </BotonSimple>
                    </Link>
                    <Link href={'/about'}>
                        <BotonSimple sx={{ borderRadius: 0, height: 50, justifyContent: 'start', px: 3, color: pathname == '/about' ? '#883944' : '#666', bgcolor: pathname == '/about' ? '#88394411' : 'transparent', fontSize: 13, }} startIcon={<IoPeople />} fullWidth>
                            Sobre Nosotros
                        </BotonSimple>
                    </Link>
                </Box>
            </Drawer>
            <ModalLogin setOpen={setOpen2} open={open2} />
        </>
    )
}


export default Navbar;
