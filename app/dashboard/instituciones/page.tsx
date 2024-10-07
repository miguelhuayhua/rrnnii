'use client';
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { TabBox } from "../componentes/Mostrar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import { axiosInstance } from "@/globals";
import { Institucion } from "@prisma/client";
import ModalInstitucion from "./Modal";
import Image from 'next/legacy/image';
import dayjs from "dayjs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Tabla from "../componentes/Tabla";
import { TbReload } from "react-icons/tb";
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import axios from "axios";
import { fileDomain } from "@/utils/globals";
import { blue } from "@mui/material/colors";
export default function Page() {
    const [opcion, setOpcion] = useState('todo');
    const { openSnackbar } = useSnackbar();
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [prevInstituciones, setPrevInstituciones] = useState<Institucion[]>([]);
    const [institucion, setInstitucion] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/institucion/todo', {}).then(res => {
            setInstituciones(res.data);
            setPrevInstituciones(res.data);
        });
    }, []);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs>
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/instituciones">
                    <Normal>Instituciones</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Instituciones
            </Titulo>
            <Stack direction='row' my={2} spacing={2}>
                <BotonFilled onClick={() => router.push('/dashboard/instituciones/crear')}>
                    Añadir institución
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axiosInstance.post('/api/institucion/todo', {}).then(res => {
                        setInstituciones(res.data);
                        setPrevInstituciones(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 4, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
                TabIndicatorProps={{ sx: { bgcolor: blue[700] } }}
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
                        setInstituciones(prevInstituciones);
                    else if (value == 'activo')
                        setInstituciones(prevInstituciones.filter(value => value.estado))
                    else if (value == 'inactivo')
                        setInstituciones(prevInstituciones.filter(value => !value.estado))
                }}  >
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} data={instituciones.map(value => (
                {
                    nombre: value.nombre,
                    "Institución": (<Box display='flex' alignItems='center' minWidth={200} py={0.35}>
                        <Box minWidth={80} width={80} height={80} position='relative'>
                            <Image src={value.logo ? fileDomain + value.logo : '/default-image.jpg'} objectFit="cover" layout="fill" style={{ borderRadius: 10 }} />
                        </Box>
                        <Box px={2}>
                            <Negrita sx={{ fontSize: 16 }}>{value.nombre}</Negrita>
                            <Normal >{value.contacto || 'Sin contacto'}</Normal>
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
                    "": (<>
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <BotonOutline sx={{ fontSize: 12 }} onClick={() => {
                                setInstitucion(value);
                            }}>Modificar</BotonOutline>

                            <SwitchBox checked={value.estado} onChange={(ev, checked) => {
                                axiosInstance.post('/api/institucion/estado', { estado: checked, id: value.id }).then(res => {
                                    openSnackbar(res.data.mensaje);
                                    axiosInstance.post('/api/institucion/todo', {}).then(res => {
                                        setInstituciones(res.data);
                                        setPrevInstituciones(res.data);
                                        setOpcion('todo');
                                    });
                                });
                            }} />
                        </Stack>
                    </>)
                }
            ))} />
            {
                institucion ?
                    <ModalInstitucion
                        Institucion={institucion}
                        setInstitucion={setInstitucion}
                        setInstituciones={setInstituciones}
                        setPrevInstituciones={setPrevInstituciones}
                    />
                    : null
            }
        </Box>
    )
}