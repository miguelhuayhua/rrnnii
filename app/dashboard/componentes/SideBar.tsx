'use client';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { MdWork } from "react-icons/md";
import { Button, Divider, Tooltip, Typography } from "@mui/material";
import { IoImage, IoPeople } from "react-icons/io5";
import { FaHandsHelping, FaTools } from "react-icons/fa";
import { FaBuilding, FaBuildingUser } from "react-icons/fa6";
import Link from 'next/link';
import Image from 'next/legacy/image';
import { HiHome } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { GiMeepleCircle } from 'react-icons/gi';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { BotonSimple } from '@/app/componentes/Botones';
//SECCIÓN DE BOTONES PARA EL SIDEBAR

const SideBarItem = ({ Icon, label, active, onclick }: { Icon: IconType, label: string, active: boolean, onclick?: any }) => {
    return (
        <Button
            onClick={() => onclick()}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textTransform: 'none',
                fontSize: 10.5,
                fontWeight: 700,
                color: active ? '#a4545b' : '#637381',
                mx: 'auto',
                borderRadius: 2,
                my: 1,
                background: active ? '#a4545b11' : 'transparent',
                width: "90%"
            }}>
            <Icon fontSize={25} />
            <Typography sx={{ color: active ? '#a4545b' : '#777', fontSize: { xs: 8.5, sm: 9, md: 10, lg: 11 }, fontWeight: 700 }}>
                {label}
            </Typography>
        </Button >
    )
}

const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Box position='sticky' bgcolor='#f4f5f7' top={0} borderRight='1px solid #eee' width={{ xs: 65, md: 90 }} height={"100vh"} zIndex={20}>
            <Box display='flex' justifyContent='center' my={2}>
                <Image src='/logorrnnii.png' width={40} height={38} layout='fixed' />
            </Box>
            <SideBarItem onclick={() => router.push('/dashboard/')} Icon={HiHome} label='Principal' active={pathname == '/dashboard'} />
            <SideBarItem onclick={() => router.push('/dashboard/convenios')} Icon={FaHandsHelping} label='Convenios' active={pathname.includes('/convenios')} />
            <SideBarItem onclick={() => router.push('/dashboard/pasantias')} Icon={MdWork} label='Pasantias' active={pathname.includes('/pasantias')} />
            <SideBarItem onclick={() => router.push('/dashboard/actividades')} Icon={GiMeepleCircle} label='Actividades' active={pathname.includes('/actividades')} />
            <SideBarItem onclick={() => router.push('/dashboard/eventos')} Icon={BsFillCalendar2EventFill} label='Eventos' active={pathname.includes('/eventos')} />
            <SideBarItem onclick={() => router.push('/dashboard/galeria')} Icon={IoImage} label='Galeria' active={pathname.includes('/galeria')} />
            <SideBarItem onclick={() => router.push('/dashboard/instituciones')} Icon={FaBuilding} label='Instituciones' active={pathname.includes('/instituciones')} />
            <Divider sx={{ borderColor: '#eee' }} />
            <Tooltip
                arrow
                PopperProps={{
                    sx: {
                        "& .MuiTooltip-tooltip": {
                            background: 'linear-gradient(50deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(255,255,255,1) 60%, rgba(255,240,240,1) 100%)',
                            borderRadius: 3,
                            p: 1,
                            boxShadow: '-10px 10px 30px #00000022',
                            ".MuiTooltip-arrow": {
                                color: 'white'
                            },
                        }
                    }
                }}
                placement='right'
                enterTouchDelay={0}
                leaveTouchDelay={0}
                title={
                    <Box>
                        <Link

                            href={'/dashboard/personal/usuarios'}>
                            <BotonSimple sx={{ fontSize: 12 }} fullWidth>
                                Usuarios
                            </BotonSimple>
                            <br />
                            <BotonSimple sx={{ fontSize: 12 }}>
                                Información Personal
                            </BotonSimple>
                        </Link>
                    </Box>}>
                <Box position='relative'>
                    <SideBarItem onclick={() => { }} Icon={IoPeople} label='Personal' active={pathname.includes('/personal')} />
                    <ArrowRightIcon style={{ position: 'absolute', top: 15, right: 0, fontSize: 20, color: '#888' }}></ArrowRightIcon>
                </Box>
            </Tooltip>
            <SideBarItem onclick={() => router.push('/dashboard/unidad')} Icon={FaBuildingUser} label='Unidad' active={pathname.includes('/unidad')} />
            <Tooltip
                arrow
                PopperProps={{
                    sx: {
                        "& .MuiTooltip-tooltip": {
                            background: 'linear-gradient(50deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(255,255,255,1) 60%, rgba(255,240,240,1) 100%)',
                            borderRadius: 3,
                            p: 1,
                            boxShadow: '-10px 10px 30px #00000022',
                            ".MuiTooltip-arrow": {
                                color: 'white'
                            },
                        }
                    }
                }}
                placement='right'
                enterTouchDelay={0}
                leaveTouchDelay={0}
                title={
                    <Box>
                        <BotonSimple onClick={() => {
                            router.push('/dashboard/herramientas/unirpdf')
                        }} sx={{ fontSize: 12 }} fullWidth>
                            Unir PDF
                        </BotonSimple>
                        <Link
                            href={'/dashboard/herramientas/imagenpdf'}>
                            <BotonSimple sx={{ fontSize: 12 }} fullWidth>
                                Imagen a PDF
                            </BotonSimple>
                        </Link>
                    </Box>}>
                <Box position='relative'>
                    <SideBarItem onclick={() => { }} Icon={FaTools} label='Herramientas' active={pathname.includes('/herramientas')} />
                    <ArrowRightIcon style={{ position: 'absolute', top: 15, right: 0, fontSize: 20, color: '#888' }}></ArrowRightIcon>
                </Box>
            </Tooltip>
        </Box>

    )
}


export default SideBar;