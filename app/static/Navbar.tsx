"use client";
import Image from 'next/legacy/image';
import { Tooltip, useScrollTrigger, Grid, Stack, LinearProgress, Drawer } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { GoDotFill } from "react-icons/go";
import { BotonSimple } from '../componentes/Botones';
import { Negrita, Normal } from '../componentes/Textos';
import { HiOutlineBars3BottomLeft } from 'react-icons/hi2';
import ModalLogin from './ModalLogin';
import { BiDownArrow, BiNews, BiVideo } from 'react-icons/bi';
import { PiDotOutlineFill } from 'react-icons/pi';
import { green, grey, red } from '@mui/material/colors';
import { Icon } from '@iconify/react';
import { RiHome5Line } from 'react-icons/ri';
import { GrGroup } from 'react-icons/gr';
import { MdOutlineHandshake } from 'react-icons/md';
import { Button } from 'rsuite';
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
            {
                pathname.endsWith('/') ? null :
                    <Box bgcolor='white' borderBottom='1px solid #ddd' zIndex={1001}>
                        <Stack spacing={0.5} direction='row'>
                            <Button style={{ display: 'flex', alignItems: 'center' }} size='xs' appearance='link'>
                                <Icon icon='ic:outline-facebook' style={{ marginLeft: 10 }} fontSize={20} />
                            </Button>
                            <Button style={{ display: 'flex', alignItems: 'center' }} size='xs' appearance='link'>
                                <Icon icon='basil:instagram-solid' fontSize={20}
                                    style={{ marginLeft: 10 }} />
                            </Button>
                            <Button style={{ display: 'flex', alignItems: 'center' }} size='xs' appearance='link'>
                                <Icon icon='mdi:youtube' fontSize={20}
                                    style={{ marginLeft: 10 }} />
                            </Button>
                            <Button appearance='link'>
                                <Icon
                                    color={green[600]}
                                    icon='mage:whatsapp-filled' fontSize={20}
                                />
                            </Button>
                        </Stack>
                    </Box>
            }
            <Box
                sx={{
                    boxShadow: trigger ? 'rgba(135, 158, 171, 0.16) 0px 8px 16px 0px' : 'none',
                    zIndex: 1001,
                    bgcolor: trigger ? 'white' : 'transparent',
                    transition: 'background .25s',
                    position: 'sticky',
                    top: 0,
                    left: 0
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
                        transition: 'padding .25s',
                        bgcolor: 'transparent'
                    }}
                >
                    <Link style={{ textDecoration: 'none' }} href={"/"} >
                        <Box display='flex' alignItems='center'>
                            <Image
                                width={50}
                                height={45}
                                layout='fixed'
                                src={"/logorrnnii.png"}
                                alt='Logo de la unidad de relaciones internacionales'
                            />
                            <Box px={0.5} display='flex' flexDirection='column' alignItems='start'>
                                <Normal sx={{ fontSize: 10, textAlign: 'start', color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900] }}>
                                    Relaciones  Internacionales
                                </Normal>
                                <Negrita sx={{ fontSize: 11, color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900] }}>
                                    Universidad Pública de El Alto
                                </Negrita>
                            </Box>
                        </Box>
                    </Link>
                    <Box display='flex' alignItems='center'>
                        <Stack display={{ xs: 'none', md: 'flex' }} direction='row' spacing={2} mr={2}>
                            <Tooltip
                                PopperProps={{
                                    sx: {
                                        "& .MuiTooltip-tooltip": {
                                            background: 'linear-gradient(50deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(255,255,255,1) 60%, rgba(255,240,240,1) 100%)',
                                            borderRadius: 3,
                                            maxWidth: 1000,
                                            width: "85vw",
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
                                        <Grid item xs={3}>
                                            <Link style={{ textDecoration: 'none' }} href={'/convenios'}>
                                                <Negrita sx={{ color: pathname.startsWith('/convenios') ? red[700] : 'inherit' }}>
                                                    Convenios
                                                </Negrita>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/convenios?t=nacional'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Nacionales
                                                </Normal>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/convenios?t=internacional'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Internacionales
                                                </Normal>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Link style={{ textDecoration: 'none' }} href={'/pasantias'}>
                                                <Negrita sx={{ color: pathname.startsWith('/pasantias') ? red[700] : 'inherit' }}>
                                                    Pasantías
                                                </Negrita>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/pasantias?d=3'}>
                                                <Normal sx={{ my: 1 }}>
                                                    3 meses
                                                </Normal>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/pasantias?d=6'}>
                                                <Normal sx={{ my: 1 }}>
                                                    6 meses
                                                </Normal>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Link style={{ textDecoration: 'none' }} href={'/becas'}>
                                                <Negrita sx={{ color: pathname.startsWith('/becas') ? red[700] : 'inherit' }}>
                                                    Becas
                                                </Negrita>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/becas?t=nacional'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Nacionales
                                                </Normal>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/becas?t=internacional'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Internacionales
                                                </Normal>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Link style={{ textDecoration: 'none' }} href={'/eventos'}>
                                                <Negrita sx={{ color: pathname.startsWith('/eventos') ? red[700] : 'inherit' }}>
                                                    Eventos
                                                </Negrita>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/eventos?t=presencial'}>
                                                <Normal sx={{ my: 1 }}>
                                                    Presenciales
                                                </Normal>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href={'/eventos?t=online'}>
                                                <Normal sx={{ my: 1 }}>
                                                    En línea
                                                </Normal>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                }
                            >
                                <Normal sx={{ display: 'flex', alignItems: 'center', color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900] }}>
                                    {(pathname.startsWith('/convenios') || pathname.startsWith('/pasantias') || pathname.startsWith('/eventos') || pathname.startsWith('/becas'))
                                        ? <GoDotFill color='inherit' /> : null}
                                    Convocatorias <FaAngleDown />
                                </Normal>
                            </Tooltip>
                            <Link style={{ textDecoration: 'none' }} href={'/noticias'}>
                                <Normal sx={{ color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/noticias' ? <GoDotFill color='inherit' /> : null}
                                    Noticias
                                </Normal>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} href={'/about'}>
                                <Normal sx={{ color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/about' ? <GoDotFill color='inherit' /> : null}
                                    Sobre Nosotros
                                </Normal>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} href={'/videos'}>
                                <Normal sx={{ color: pathname.endsWith('/') ? trigger ? grey[900] : grey[50] : grey[900], alignItems: 'center', display: 'flex' }}>
                                    {pathname == '/videos' ? <GoDotFill color='inherit' /> : null}
                                    Videos
                                </Normal>
                            </Link>
                        </Stack>
                        <Button
                            appearance='primary'
                            endIcon={<FaAngleRight />} style={{ color: 'white', background: pathname.endsWith('/') ? trigger ? red[900] : "#00000033" : red[900], backdropFilter: 'blur(6px)', fontSize: 13 }} onClick={() => {
                                setOpen2(true);
                            }}>
                            Iniciar sesión
                        </Button>

                        <BotonSimple sx={{ display: { xs: 'block', md: 'none' }, height: 36, color: 'white', background: pathname.endsWith('/') ? trigger ? [900] : "#00000033" : grey[900], backdropFilter: 'blur(6px)', position: 'relative', left: 10 }} onClick={() => {
                            setOpen(true);
                        }}>
                            <HiOutlineBars3BottomLeft fontSize={24} />
                        </BotonSimple>
                    </Box>
                </Container>
            </Box >

            <Drawer anchor='top' open={open} onClose={() => setOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box py={1}>
                    <Link style={{ textDecoration: 'none' }} href={'/'}>
                        <BotonSimple sx={{ borderRadius: 0, p: 2, justifyContent: 'start', color: pathname == '/' ? red[700] : grey[800] }} startIcon={<RiHome5Line />} fullWidth>
                            Principal
                        </BotonSimple>
                    </Link>
                    <BotonSimple
                        onClick={() => setOpen3(!open3)}
                        sx={{ borderRadius: 0, p: 2, justifyContent: 'start', color: pathname == 'f' ? red[700] : grey[800] }} startIcon={<MdOutlineHandshake />} fullWidth>
                        Convocatorias <BiDownArrow style={{ position: 'absolute', right: 10, transform: open3 ? 'rotateZ(180deg)' : 'rotateZ(0deg)', transition: 'transform 0.5s' }} />
                    </BotonSimple>
                    <Box display={open3 ? 'block' : 'none'}>
                        <Link style={{ textDecoration: 'none' }} href={'/convenios'}>
                            <BotonSimple sx={{ borderRadius: 0, justifyContent: 'start', p: 2, color: pathname.includes('/convenios') ? red[700] : grey[800] }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Convenios
                            </BotonSimple>
                        </Link>
                        <Link style={{ textDecoration: 'none' }} href={'/pasantias'}>
                            <BotonSimple sx={{ borderRadius: 0, justifyContent: 'start', p: 2, color: pathname.includes('/pasantias') ? red[700] : grey[800] }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Pasantías
                            </BotonSimple>
                        </Link>
                        <Link style={{ textDecoration: 'none' }} href={'/becas'}>
                            <BotonSimple sx={{ borderRadius: 0, justifyContent: 'start', p: 2, color: pathname.includes('/becas') ? red[700] : grey[800] }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Becas
                            </BotonSimple>
                        </Link>
                        <Link style={{ textDecoration: 'none' }} href={'/eventos'}>
                            <BotonSimple sx={{ borderRadius: 0, justifyContent: 'start', p: 2, color: pathname.includes('/eventos') ? red[700] : grey[800] }} startIcon={<PiDotOutlineFill />} fullWidth>
                                Eventos
                            </BotonSimple>
                        </Link>
                    </Box>
                    <Link style={{ textDecoration: 'none' }} href={'/noticias'}>
                        <BotonSimple sx={{ borderRadius: 0, p: 2, justifyContent: 'start', color: pathname == '/noticias' ? red[700] : grey[800] }} startIcon={<BiNews />} fullWidth>
                            Noticias
                        </BotonSimple>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href={'/about'}>
                        <BotonSimple sx={{ borderRadius: 0, p: 2, justifyContent: 'start', color: pathname == '/about' ? red[700] : grey[800] }} startIcon={<GrGroup />} fullWidth>
                            Sobre Nosotros
                        </BotonSimple>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href={'/videos'}>
                        <BotonSimple sx={{ borderRadius: 0, p: 2, justifyContent: 'start', color: pathname == '/videos' ? red[700] : grey[800] }} startIcon={<BiVideo />} fullWidth>
                            Videos
                        </BotonSimple>
                    </Link>
                </Box>
            </Drawer>
            <ModalLogin setOpen={setOpen2} open={open2} />
        </>
    )
}


export default Navbar;
