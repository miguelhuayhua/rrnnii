'use client';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { Divider, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import { Normal } from '@/app/componentes/Textos';
import { blue, grey, red } from '@mui/material/colors';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from 'rsuite';
import { Icon } from '@iconify/react';
//SECCIÓN DE BOTONES PARA EL SIDEBAR

const SideBarItem = ({ icon, label, active, onclick }: {
    icon: string, label: string, active: boolean, onclick?: any
}) => {
    return (
        <Button
            onClick={() => onclick()}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                textTransform: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: active ? grey[50] : grey[900],
                margin: '5px auto',
                borderRadius: 7,
                padding: '10px 15px',
                background: active ? grey[900] : 'transparent',
                width: "92%"
            }}>
            <Icon icon={icon} fontSize={20} />
            <Normal sx={{ fontWeight: 700, fontSize: 15, ml: 2 }}>
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
        <Box position='sticky'
            bgcolor='white'
            pt={2}
            top={0} borderRight={{ xs: 'none', md: '1px solid #ccc' }}
            width={300} minWidth={95} overflow={'scroll'} height={"100vh"} zIndex={2}>
            <SideBarItem onclick={() => {
                router.push('/dashboard/');
                setMove(false);
            }} icon='carbon:home' label='Principal' active={pathname == '/dashboard'} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/convenios');
                setMove(false);
            }} icon='fluent-emoji-high-contrast:handshake' label='Convenios' active={pathname.includes('/convenios')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/pasantias');
                setMove(false);
            }} icon='solar:suitcase-outline' label='Pasantias' active={pathname.includes('/pasantias')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/becas');
                setMove(false);
            }} icon='mynaui:academic-hat' label='Becas' active={pathname.includes('/becas')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/eventos');
                setMove(false);
            }} icon='mynaui:calendar' label='Eventos' active={pathname.includes('/eventos')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/noticias');
                setMove(false);
            }} icon='fluent:news-28-regular' label='Noticias' active={pathname.includes('/noticias')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/instituciones');
                setMove(false);
            }} icon='hugeicons:building-02' label='Instituciones' active={pathname.includes('/instituciones')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/carreras');
                setMove(false);
            }} icon='hugeicons:university' label='Carreras' active={pathname.includes('/carreras')} />
            <SideBarItem onclick={() => {
                router.push('/dashboard/videos');
                setMove(false);
            }} icon='mynaui:video' label='Videos' active={pathname.includes('/videos')} />
            <Divider sx={{ borderColor: '#ccc' }} />
            {
                data?.user.rol == 'admin' ?
                    <SideBarItem onclick={() => {
                        router.push('/dashboard/usuarios');
                        setMove(false);
                    }}
                        icon='ph:users-three'
                        label='Personal'
                        active={pathname.includes('/usuarios')} />
                    : null
            }
            <SideBarItem onclick={() => {
                router.push('/dashboard/unidad');
                setMove(false);
            }} icon='ph:office-chair-light' label='Unidad' active={pathname.includes('/unidad')} />
            {
                data?.user.rol == 'admin' ?
                    <SideBarItem onclick={() => {
                        router.push('/dashboard/acciones');
                        setMove(false);
                    }} icon='hugeicons:audit-02' label='Acciones' active={pathname.includes('/acciones')} />
                    : null
            }
        </Box>
    )
    return (
        <>
            {
                md ?
                    <>
                        <Button
                            appearance='subtle'
                            onClick={() => { setMove(!move); }}
                            style={{
                                position: 'fixed',
                                top: 12, right: 70, zIndex: 210,

                            }}>
                            <Icon icon='ci:menu-alt-05' fontSize={35} />
                        </Button>
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