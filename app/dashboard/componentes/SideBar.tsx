'use client';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { MdDiscount, MdInventory, MdWork } from "react-icons/md";
import { Button, ClickAwayListener, Divider, Grid, Tooltip, Typography } from "@mui/material";
import { useState } from 'react';
import { IoBag, IoImage, IoPeople } from "react-icons/io5";
import { useSession } from 'next-auth/react';
import { FaHandsHelping, FaStoreAlt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { PiNotebookFill } from "react-icons/pi";
import { FaHammer } from "react-icons/fa";
import { FaBuilding, FaLocationDot } from "react-icons/fa6";
import { GrConfigure } from 'react-icons/gr';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { MdOutlineAttachMoney } from "react-icons/md";
import { HiHome } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { GiMeepleCircle } from 'react-icons/gi';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { Negrita } from '@/app/componentes/Textos';
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
            <span style={{ color: active ? '#a4545b' : '#777' }}>
                {label}
            </span>
        </Button>
    )
}

const SideBar = () => {
    const router = useRouter();
    const [label, setLabel] = useState('');
    const { data } = useSession();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
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
                            <BotonSimple sx={{ fontSize: 12 }}>
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

            <SideBarItem onclick={() => router.push('/dashboard/unidad')} Icon={FaBuilding} label='Unidad' active={pathname.includes('/unidad')} />
        </Box>

    )
}


export default SideBar;