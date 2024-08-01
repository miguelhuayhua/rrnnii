"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Evento } from "@prisma/client";
import ModalEvento from "./Modal";
import { RiEditFill } from "react-icons/ri";
import { IoReload } from "react-icons/io5";
import EventoComponent from "../componentes/items/Evento";
import Image from 'next/legacy/image';
import { BiSearch } from "react-icons/bi";
import { filtrarValorEnArray } from "@/utils/data";
import { FaAngleLeft, FaAngleRight, FaFileWord } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [prevEventos, setPrevEventos] = useState<Evento[]>([]);
    const [evento, setEvento] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/evento/todo', { opcion }).then(res => {
            setEventos(res.data);
            setPrevEventos(res.data);
        })
    }, [opcion, evento]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <BotonSimple
                startIcon={<MdArrowLeft fontSize={20} />}
                onClick={() => router.back()}>
                Regresar
            </BotonSimple>
            <Titulo sx={{ mt: 1 }}>
                Eventos
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/eventos">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/eventos">
                    <Normal>Eventos</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/eventos/crear')}>
                    Añadir evento
                </BotonFilled>
                <BotonSimple onClick={() => router.refresh()}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 4 }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => {
                    setOpcion(value);
                    if (value == 'todo')
                        setEventos(prevEventos);
                    else if (value == 'activo')
                        setEventos(prevEventos.filter(value => value.estado))
                    else if (value == 'inactivo')
                        setEventos(prevEventos.filter(value => !value.estado))
                }}  >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} hasPagination data={eventos.map(value => (
                {
                    id: value.id,
                    nombre: value.titulo,
                    Actividad: (
                        <Box display='flex' minWidth={300} py={0.35}>
                            <Box minWidth={90} width={90} height={90} position='relative'>
                                <Image src={value.imagen} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                            </Box>
                            <Box px={2}>
                                <Negrita sx={{ fontSize: 16 }}>{value.titulo}</Negrita>
                                <Normal >{value.tipo.toUpperCase()}</Normal>
                            </Box>
                        </Box>
                    ),
                    "Creado el": (
                        <Box minWidth={100}>
                            <Negrita sx={{ fontSize: 13 }}>
                                {dayjs(value.createdAt).format('DD/MM/YYYY')}
                            </Negrita>
                            <Normal sx={{ fontSize: 11 }}>
                                {dayjs(value.createdAt).format('HH:mm:ss')}
                            </Normal>
                        </Box>
                    ),
                    "": (<Stack direction='row' spacing={2}>
                        <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                            setEvento(value);
                        }}>Modificar</BotonOutline>
                        {
                            value.pdf ?
                                <BotonFilled
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = value.pdf;
                                        a.href = value.pdf;
                                        a.click();
                                        a.remove();
                                    }}
                                    sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700] }}>
                                    {
                                        value.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <FaFileWord />
                                    }
                                </BotonFilled> : null
                        }
                    </Stack>)
                }
            ))} />
            {
                evento ?
                    <ModalEvento
                        Evento={evento}
                        setEvento={setEvento}
                    />
                    : null
            }
        </Box>
    )
}