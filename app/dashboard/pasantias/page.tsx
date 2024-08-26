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
import { Institucion, Pasantia } from "@prisma/client";
import Image from 'next/legacy/image';
import ModalPasantia from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { TbPdf, TbReload } from "react-icons/tb";
import { red } from "@mui/material/colors";
import 'dayjs/locale/es';
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [Pasantias, setPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [prevPasantias, setPrevPasantias] = useState<(Pasantia & { Institucion: Institucion })[]>([]);
    const [Pasantia, setPasantia] = useState<any>(null);
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/pasantia/todo', { opcion }).then(res => {
            setPasantias(res.data);
            setPrevPasantias(res.data);
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
                Pasantías
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/pasantias">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/Pasantias">
                    <Normal>Pasantias</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/pasantias/crear')}>
                    Añadir Pasantia
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axiosInstance.post('/api/pasantia/todo', { opcion }).then(res => {
                        setPasantias(res.data);
                        setPrevPasantias(res.data);
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
                        setPasantias(prevPasantias);
                    else if (value == 'vigente')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0))
                    else if (value == 'activo')
                        setPasantias(prevPasantias.filter(value => value.estado))
                    else if (value == 'concluido')
                        setPasantias(prevPasantias.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0))
                    else if (value == 'inactivo')
                        setPasantias(prevPasantias.filter(value => !value.estado))
                }}>
                <TabBox label="Todos" value='todo' />
                <TabBox label="Vigentes" value='vigente' />
                <TabBox label="Concluídos" value='concluido' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} data={Pasantias.map(value => (
                {
                    id: value.id,
                    nombre: value.titulo,
                    Pasantia: (
                        <Box display='flex' minWidth={200} py={0.35} alignItems='center'>
                            <Box minWidth={90} width={90} height={90} position='relative'>
                                <Image src={value.imagen} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                            </Box>
                            <Box px={2}>
                                <Negrita sx={{ fontSize: 16 }}>{value.titulo}</Negrita>
                                <Normal >Duración: {value.modalidad} meses</Normal>
                            </Box>
                        </Box>
                    ),
                    "Creado el": (
                        <Box minWidth={90}>
                            <Negrita sx={{ fontSize: 13 }}>
                                {dayjs(value.createdAt).format('DD/MM/YYYY')}
                            </Negrita>
                            <Normal sx={{ fontSize: 11 }}>
                                {dayjs(value.createdAt).format('HH:mm:ss')}
                            </Normal>
                        </Box>
                    ),
                    "Institución": value.Institucion.nombre,
                    "Finaliza el": dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY'),
                    "": (<>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                                setPasantia(value);
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
                                        sx={{ background: red[700] }}>
                                        <TbPdf fontSize={22} />
                                    </BotonFilled> : null
                            }
                            <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                axiosInstance.post('/api/pasantia/estado', { estado: checked, id: value.id }).then(res => {
                                    openSnackbar(res.data.mensaje);
                                    axiosInstance.post('/api/pasantia/todo', {}).then(res => {
                                        setPasantias(res.data);
                                        setPrevPasantias(res.data);
                                        setOpcion('todo');
                                    });

                                });
                            }} />
                        </Stack>
                    </>)
                }
            ))} />
            {
                Pasantia ?
                    <ModalPasantia
                        Pasantia={Pasantia}
                        setPasantia={setPasantia}
                    />
                    : null
            }
        </Box>
    )
}