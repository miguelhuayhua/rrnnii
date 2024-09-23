"use client";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Evento } from "@prisma/client";
import ModalEvento from "./Modal";
import { RiFileWord2Line } from "react-icons/ri";
import Image from 'next/legacy/image';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import axios from "axios";
import { fileDomain } from "@/utils/globals";

export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [prevEventos, setPrevEventos] = useState<Evento[]>([]);
    const [evento, setEvento] = useState<any>(null);
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/evento/todo').then(res => {
            setEventos(res.data);
            setPrevEventos(res.data);
        });
    }, []);
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
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/eventos">
                    <Normal>Eventos</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/eventos/crear')}>
                    Añadir evento
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axiosInstance.post('/api/evento/todo', { opcion }).then(res => {
                        setEventos(res.data);
                        setPrevEventos(res.data);
                        setOpcion('todo');
                    });
                }}>
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
                    else if (value == 'vigente')
                        setEventos(prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setEventos(prevEventos.filter(value => dayjs(value.inicio, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setEventos(prevEventos.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setEventos(prevEventos.filter(value => !value.estado));
                }}  >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Vigentes" value='vigente' />
                <TabBox label="Concluidos" value='concluido' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} hasPagination data={eventos.map(value => (
                {
                    id: value.id,
                    nombre: value.titulo,
                    Evento: (
                        <Box display='flex' minWidth={300} py={0.35} alignItems='center'>
                            <Box minWidth={80} width={80} height={80} position='relative'>
                                <Image src={fileDomain + value.imagen} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                            </Box>
                            <Box px={2}>
                                <Negrita sx={{ fontSize: 16 }}>{value.titulo}</Negrita>
                                <Normal><b>Tipo: </b>{value.tipo.toUpperCase()}</Normal>
                            </Box>
                        </Box>
                    ),
                    "Inicia el": (
                        <Box minWidth={100}>
                            <Negrita sx={{ fontSize: 13 }}>
                                {value.inicio}
                            </Negrita>
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
                    "": (<Stack direction='row' spacing={2} alignItems='center'>
                        <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                            setEvento(value);
                        }}>Modificar</BotonOutline>
                        {
                            value.pdf ?
                                <BotonFilled
                                    onClick={() => {
                                        let a = document.createElement('a');
                                        a.download = fileDomain + value.pdf;
                                        a.href = fileDomain + value.pdf;
                                        a.target = '_blank';
                                        a.click();
                                        a.remove();
                                    }}
                                    sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700], px: 1.4 }}>
                                    {
                                        value.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <RiFileWord2Line fontSize={22} />
                                    }
                                </BotonFilled> : null
                        }
                        <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                            axiosInstance.post('/api/convenio/estado', { estado: checked, id: value.id }).then(res => {
                                openSnackbar(res.data.mensaje);
                                axiosInstance.post('/api/evento/todo', { opcion }).then(res => {
                                    setEventos(res.data);
                                    setPrevEventos(res.data);
                                    setOpcion('todo');
                                });
                            });
                        }} />
                    </Stack>)
                }
            ))} />
            {
                evento ?
                    <ModalEvento
                        Evento={evento}
                        setEvento={setEvento}
                        setEventos={setEventos}
                        setPrevEventos={setPrevEventos}
                    />
                    : null
            }
        </Box>
    )
}