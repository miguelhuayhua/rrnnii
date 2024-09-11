'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import Tabla from "../componentes/Tabla";
import Image from 'next/legacy/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Convenio, Institucion } from "@prisma/client";
import ModalConvenio from "./Modal";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { TbPdf, TbReload } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { RiFileWord2Line } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [convenios, setConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const [convenio, setConvenio] = useState<any>(null);
    const [prevConvenios, setPrevConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const { openSnackbar } = useSnackbar();
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/convenio/todo', {}).then(res => {
            setConvenios(res.data);
            setPrevConvenios(res.data);
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
                Convenios
            </Titulo>
            <Breadcrumbs >
                <Link href="/dashboard/convenios">
                    <Normal>Principal</Normal>
                </Link>
                <Link href="/dashboard/convenios">
                    <Normal>Convenios</Normal>
                </Link>
                <Normal>Listado</Normal>
            </Breadcrumbs>
            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/convenios/crear')}>
                    Añadir convenio
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axiosInstance.post('/api/convenio/todo', {}).then(res => {
                        setConvenios(res.data);
                        setPrevConvenios(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs sx={{ mb: 4 }}
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
                        setConvenios(prevConvenios);
                    else if (value == 'vigente')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0));
                    else if (value == 'concluido')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0));
                    else if (value == 'activo')
                        setConvenios(prevConvenios.filter(value => value.estado));
                    else if (value == 'inactivo')
                        setConvenios(prevConvenios.filter(value => !value.estado));
                }} >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Vigentes" value='vigente' />
                <TabBox label="Concluídos" value='concluido' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} hasPagination data={convenios.map(value => (
                {
                    id: value.id,
                    nombre: value.titulo,
                    Convenio: (
                        <Box display='flex' width={350} minWidth={300} py={0.35}>
                            <Box minWidth={80} width={80} height={80} position='relative'>
                                <Image src={"http://localhost:4000" + value.imagen} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                            </Box>
                            <Box px={1} display='flex' flexDirection='column' justifyContent='center'>
                                <Negrita sx={{ fontSize: 13 }}>{value.titulo}</Negrita>
                                <Normal >{value.tipo.toUpperCase()}</Normal>
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
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                                setConvenio(value);
                            }}>Modificar</BotonOutline>
                            {
                                value.pdf ?
                                    <BotonFilled
                                        onClick={() => {
                                            let a = document.createElement('a');
                                            a.download = fileDomain + value.pdf;
                                            a.target = '_blank';
                                            a.href = fileDomain + value.pdf;
                                            a.click();
                                            a.remove();
                                        }}
                                        sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700] }}>
                                        {
                                            value.pdf.includes('pdf') ? <TbPdf fontSize={22} /> : <RiFileWord2Line fontSize={22} />
                                        }
                                    </BotonFilled> : null
                            }
                            <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                axiosInstance.post('/api/convenio/estado', { estado: checked, id: value.id }).then(res => {
                                    openSnackbar(res.data.mensaje);
                                    axiosInstance.post('/api/convenio/todo', {}).then(res => {
                                        setConvenios(res.data);
                                        setPrevConvenios(res.data);
                                        setOpcion('todo');
                                    });
                                });
                            }} />
                        </Stack>
                    </>)
                }
            ))} />
            {
                convenio ?
                    <ModalConvenio
                        Convenio={convenio}
                        setConvenio={setConvenio}
                        setConvenios={setConvenios}
                        setPrevConvenios={setPrevConvenios}
                        setOpcion={setOpcion}
                    />
                    : null
            }
        </Box>
    )
}