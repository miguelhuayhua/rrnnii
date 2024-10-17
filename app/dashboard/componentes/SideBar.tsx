'use client';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { MdWork } from "react-icons/md";
import { Button, Divider, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import { IoPeople } from "react-icons/io5";
import { FaHandsHelping, FaTools } from "react-icons/fa";
import { FaBuilding, FaBuildingUser } from "react-icons/fa6";
import Image from 'next/legacy/image';
import { HiHome, HiNewspaper } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { GiMeepleCircle } from 'react-icons/gi';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { BotonOutline, BotonSimple } from '@/app/componentes/Botones';
import { Normal } from '@/app/componentes/Textos';
import { blue, grey, red } from '@mui/material/colors';
import { useState } from 'react';
import { CgMenuLeft } from 'react-icons/cg';
import { BiSolidInstitution } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
//SECCIÓN DE BOTONES PARA EL SIDEBAR

const SideBarItem = ({ Icon, label, active, onclick }: { Icon: IconType, label: string, active: boolean, onclick?: any }) => {
    return (
        <Button
            onClick={() => onclick()}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                textTransform: 'none',
                fontSize: 10.5,
                fontWeight: 700,
                color: active ? blue[500] : grey[900],
                mx: 'auto',
                borderRadius: 4,
                my: 0.25,
                py: 1.1,
                background: active ? blue[50] : 'transparent',
                width: "90%"
            }}>
            <Box sx={{ background: 'white', padding: 1, borderRadius: 3, height: 35 }}>
                <Icon fontSize={18} />
            </Box>
            <Normal sx={{ color: grey[900], fontWeight: 700, fontSize: 14, ml: 1 }}>
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
    const { data } = useSession();
    const Side = () => (
        <Box position='sticky' top={0} borderRight='1px solid #eee' width={250} minWidth={95} overflow={'scroll'} px={0.5} height={"100vh"} zIndex={20}>
            <Box display='flex' justifyContent='center' my={2}>
                <Image src='/logorrnnii.png' width={40} height={38} layout='fixed' />
            </Box>
            <SideBarItem onclick={() => {
                router.push('/dashboard/');
                setMove(false);
            }} Icon={HiHome} label='Principal' active={pathname == '/dashboard'} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/convenios');
                setMove(false);
            }} Icon={FaHandsHelping} label='Convenios' active={pathname.includes('/convenios')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/pasantias');
                setMove(false);
            }} Icon={MdWork} label='Pasantias' active={pathname.includes('/pasantias')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/becas');
                setMove(false);
            }} Icon={GiMeepleCircle} label='Becas' active={pathname.includes('/becas')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/eventos');
                setMove(false);
            }} Icon={BsFillCalendar2EventFill} label='Eventos' active={pathname.includes('/eventos')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/noticias');
                setMove(false);
            }} Icon={HiNewspaper} label='Noticias' active={pathname.includes('/noticias')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/instituciones');
                setMove(false);
            }} Icon={FaBuilding} label='Instituciones' active={pathname.includes('/instituciones')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/carreras');
                setMove(false);
            }} Icon={BiSolidInstitution} label='Carreras' active={pathname.includes('/carreras')} />
            <Divider sx={{ borderColor: '#eee' }} />

            {
                data?.user.rol == 'admin' ?
                    <SideBarItem onclick={() => {
                        router.push('/dashboard/usuarios');
                        setMove(false);
                    }}
                        Icon={IoPeople}
                        label='Personal'
                        active={pathname.includes('/usuarios')} />
                    : null
            }
            <SideBarItem onclick={() => {
                router.push('/dashboard/unidad');
                setMove(false);
            }} Icon={FaBuildingUser} label='Unidad' active={pathname.includes('/unidad')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/herramientas');
                setMove(false);
            }} Icon={FaTools} label='Herramientas' active={pathname.includes('/herramientas')} />
        </Box>
    )
    return (
        <>
            {
                md ?
                    <>
                        <BotonOutline
                            onClick={() => { setMove(!move); }}
                            sx={{
                                position: 'fixed',
                                top: 17, left: 15, zIndex: 20,
                                bgcolor: 'white'
                            }}>
                            <CgMenuLeft fontSize={27} />
                        </BotonOutline>
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