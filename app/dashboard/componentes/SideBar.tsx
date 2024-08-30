'use client';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { MdWork } from "react-icons/md";
import { Button, Divider, SwipeableDrawer, Tooltip, useMediaQuery, useTheme } from "@mui/material";
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
import { Normal } from '@/app/componentes/Textos';
import { blue, grey, red } from '@mui/material/colors';
import { useState } from 'react';
import { CgMenuLeft } from 'react-icons/cg';
import { BiSolidInstitution } from 'react-icons/bi';
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
                color: active ? blue[700] : grey[700],
                mx: 'auto',
                borderRadius: 2,
                my: 0.5,
                background: active ? blue[50] : 'transparent',
                width: "90%"
            }}>
            <Icon fontSize={25} />
            <Normal sx={{ color: active ? blue[700] : grey[700], fontWeight: 700, fontSize: 12.5 }}>
                {label}
            </Normal>
        </Button >
    )
}

const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const [move, setMove] = useState(false);
    const Side = () => (
        <Box position='sticky' top={0} borderRight='1px solid #eee' width={95} minWidth={95} overflow={'scroll'} px={0.5} height={"100vh"} zIndex={20}>
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
            <SideBarItem onclick={() => router.push('/dashboard/carreras')} Icon={BiSolidInstitution} label='Carreras' active={pathname.includes('/carreras')} />
            <Divider sx={{ borderColor: '#eee' }} />
            <SideBarItem onclick={() => { router.push('/dashboard/usuarios') }} Icon={IoPeople} label='Personal y usuarios' active={pathname.includes('/usuarios')} />
            <SideBarItem onclick={() => router.push('/dashboard/unidad')} Icon={FaBuildingUser} label='Unidad' active={pathname.includes('/unidad')} />

            <SideBarItem onclick={() => { router.push('/dashboard/herramientas') }} Icon={FaTools} label='Herramientas' active={pathname.includes('/herramientas')} />
        </Box>
    )
    return (
        <>
            {
                md ?
                    <>
                        <BotonSimple
                            onClick={() => { setMove(!move); }}
                            sx={{ position: 'fixed', top: 17, left: 15, zIndex: 20 }}>
                            <CgMenuLeft fontSize={27} />
                        </BotonSimple>
                        <SwipeableDrawer
                            sx={{ overflowY: 'scroll' }}
                            anchor={'left'}
                            open={move}
                            onClose={() => { setMove(false); }}
                            onOpen={() => setMove(true)}
                        >
                            <Side />
                        </SwipeableDrawer>
                    </>
                    :
                    <Side />
            }
        </>
    )
}


export default SideBar;