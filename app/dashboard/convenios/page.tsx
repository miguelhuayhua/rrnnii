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
import { FaAngleLeft, FaAngleRight, FaFileWord } from "react-icons/fa";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { TbPdf } from "react-icons/tb";
import { blue, red } from "@mui/material/colors";
dayjs.locale('es');
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const [convenios, setConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const [convenio, setConvenio] = useState<any>(null);
    const [prevConvenios, setPrevConvenios] = useState<(Convenio & { Institucion: Institucion })[]>([]);
    const router = useRouter();
    useEffect(() => {
        axiosInstance.post('/api/convenio/todo', {}).then(res => {
            setConvenios(res.data);
            setPrevConvenios(res.data);
        })
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
            <Stack direction='row' my={2} >
                <BotonFilled onClick={() => router.push('/dashboard/convenios/crear')}>
                    Añadir convenio
                </BotonFilled>
            </Stack>
            <Tabs sx={{ mb: 4 }}
                ScrollButtonComponent={(props) =>
                    <BotonSimple  {...props}>
                        {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />
                        }
                    </BotonSimple>}
                variant="scrollable"
                allowScrollButtonsMobile
                value={opcion}
                onChange={(_, value) => {
                    setOpcion(value);
                    if (value == 'todo')
                        setConvenios(prevConvenios);
                    else if (value == 'activo')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0))
                    else if (value == 'concluido')
                        setConvenios(prevConvenios.filter(value => dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) < 0))

                }} >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Concluídos" value='concluido' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} hasPagination data={convenios.map(value => (
                {
                    id: value.id,
                    nombre: value.titulo,
                    Convenio: (
                        <Box display='flex' minWidth={200} py={0.35}>
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
                        <Stack direction='row' spacing={2}>
                            <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                                setConvenio(value);
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
                        </Stack>
                    </>)
                }
            ))} />
            {
                convenio ?
                    <ModalConvenio
                        Convenio={convenio}
                        setConvenio={setConvenio}
                    />
                    : null
            }
        </Box>
    )
}