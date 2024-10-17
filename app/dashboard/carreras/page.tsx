'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Carrera } from "@prisma/client";
import Image from 'next/legacy/image';
import dayjs from "dayjs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import { TbReload } from "react-icons/tb";
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import ModalCarrera from "./Modal";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { blue } from "@mui/material/colors";
import { ChipBox } from "@/app/componentes/Mostrar";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const { openSnackbar } = useSnackbar();
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [prevCarreras, setPrevCarreras] = useState<Carrera[]>([]);
    const [carrera, setCarrera] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/carrera/todo', {}).then(res => {
            setCarreras(res.data);
            setPrevCarreras(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/carreras">
                    <Normal>Carreras</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Carreras
            </Titulo>
            <Stack direction='row' my={2} spacing={2}>
                <BotonFilled onClick={() => router.push('/dashboard/carreras/crear')}>
                    Añadir carrera
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/carrera/todo', {}).then(res => {
                        setCarreras(res.data);
                        setPrevCarreras(res.data);
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
                TabIndicatorProps={{ sx: { bgcolor: blue[500] } }}
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
                        setCarreras(prevCarreras);
                    else if (value == 'activo')
                        setCarreras(prevCarreras.filter(value => value.estado))
                    else if (value == 'inactivo')
                        setCarreras(prevCarreras.filter(value => !value.estado))
                }}  >
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevCarreras.length} />
                    </Box>}
                    value='todo' />

                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevCarreras.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevCarreras.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <Tabla
                hasPagination
                skipColumns={{ nombre: true }} data={carreras.map(value => (
                    {
                        nombre: value.nombre,
                        "Carrera": (<Box display='flex' minWidth={200} py={0.35} alignItems='center'>
                            <Box minWidth={90} width={90} height={90} position='relative'>
                                <Image src={value.logo ? fileDomain + value.logo : '/default-image.jpg'} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                            </Box>
                            <Normal ml={1}>
                                {value.nombre}
                                <br />
                                {value.contacto || ''}
                            </Normal>
                        </Box>
                        ),
                        "Creado el": (
                            <Box minWidth={90}>
                                <Negrita sx={{ fontSize: 14 }}>
                                    {dayjs(value.createdAt).format('DD/MM/YYYY')}
                                </Negrita>
                                <Normal sx={{ fontSize: 12 }}>
                                    {dayjs(value.createdAt).format('HH:mm:ss')}
                                </Normal>
                            </Box>
                        ),
                        "": (<>
                            <Stack direction='row' alignItems='center' spacing={2}>
                                <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                                    setCarrera(value);
                                }}>Modificar</BotonOutline>

                                <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                    axios.post('/api/carrera/estado', { estado: checked, id: value.id }).then(res => {
                                        openSnackbar(res.data.mensaje);
                                        axios.post('/api/carrera/todo', {}).then(res => {
                                            setCarreras(res.data);
                                            setPrevCarreras(res.data);
                                        });
                                    });
                                }} />
                            </Stack>
                        </>)
                    }
                ))} />
            {
                carrera ?
                    <ModalCarrera
                        Carrera={carrera}
                        setCarrera={setCarrera}
                        setCarreras={setCarreras}
                        setPrevCarreras={setPrevCarreras}
                    />
                    : null
            }
        </Box>
    )
}