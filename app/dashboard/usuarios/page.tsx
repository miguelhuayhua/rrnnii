'use client';
import { Box, Breadcrumbs, Link, Stack, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/globals";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
import { MdArrowLeft } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { TbReload } from "react-icons/tb";
import { FaAngleLeft, FaAngleRight, FaUser } from "react-icons/fa";
import { TabBox } from "../componentes/Mostrar";
import Tabla from "../componentes/Tabla";
import dayjs from "dayjs";
import { Persona } from "@prisma/client";
import ModalUsuario from "./ModalUsuario";
import ModalPersonal from "./ModalPersonal";
import axios from "axios";
import { SwitchBox } from "@/app/componentes/Datos";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { blue } from "@mui/material/colors";
export default function Main() {
    const [opcion, setOpcion] = useState('todo');
    const { openSnackbar } = useSnackbar();
    const [Personas, setPersonas] = useState<any>([]);
    const [prevPersonas, setPrevPersonas] = useState<any>([]);
    const [Persona, setPersona] = useState<any>(null);
    const [personaCi, setPersonaCi] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/persona/todo').then(res => {
            setPersonas(res.data);
            setPrevPersonas(res.data);
        });
    }, [opcion, Persona]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs >
                <Link style={{ textDecoration: 'none' }} href="/dashboard">
                    <Normal>Principal</Normal>
                </Link>
                <Link style={{ textDecoration: 'none' }} href="/dashboard/usuarios">
                    <Normal>Personal</Normal>
                </Link>
                <Negrita>Listado</Negrita>
            </Breadcrumbs>
            <Titulo sx={{ mt: 1 }}>
                Personal
            </Titulo>

            <Stack direction='row' my={2} spacing={2} >
                <BotonFilled onClick={() => router.push('/dashboard/usuarios/crear')}>
                    Añadir Personal
                </BotonFilled>
                <BotonSimple onClick={() => {
                    axios.post('/api/persona/todo').then(res => {
                        setPersonas(res.data);
                        setPrevPersonas(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </BotonSimple>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, border: '2px solid #ddd' }}
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
                        setPersonas(prevPersonas);
                    else if (value == 'activo')
                        setPersonas(prevPersonas.filter((value: Persona) => value.estado))
                    else if (value == 'inactivo')
                        setPersonas(prevPersonas.filter((value: Persona) => !value.estado))
                }}>
                <TabBox label="Todos" value='todo' />
                <TabBox label="Activos" value='activo' />
                <TabBox label="Inactivos" value='inactivo' />
            </Tabs>
            <Tabla skipColumns={{ nombre: true }} data={Personas.map((value: Persona) => (
                {
                    CI: value.ci,
                    "Datos personales": `${value.nombre} ${value.paterno} ${value.materno}`,
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
                    "": (
                        <>
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <BotonOutline
                                    onClick={() => { setPersona(value) }}
                                    sx={{ fontSize: 12 }}>
                                    Modificar
                                </BotonOutline>
                                <BotonOutline
                                    sx={{ p: 1.16 }}
                                    onClick={() => {
                                        setPersonaCi(value.ci);
                                    }}>
                                    <FaUser />
                                </BotonOutline>
                                <SwitchBox checked={value.estado}
                                    onChange={(ev, checked) => {
                                        axios.post('/api/persona/estado', { estado: checked, ci: value.ci }).then(res => {
                                            openSnackbar(res.data.mensaje);
                                            axios.post('/api/persona/todo').then(res => {
                                                setPersonas(res.data);
                                                setPrevPersonas(res.data);
                                                setOpcion('todo');
                                            });
                                        });
                                    }} />
                            </Stack>
                        </>
                    )

                }
            ))} />
            {
                Persona ?
                    <ModalPersonal
                        Persona={Persona}
                        setPersona={setPersona}
                        setPersonas={setPersonas}
                        setPrevPersonas={setPrevPersonas}
                    />
                    : null
            }
            {
                personaCi ?
                    <ModalUsuario
                        personaCi={personaCi}
                        setPersonaCi={setPersonaCi}
                    /> : null
            }
        </Box>
    )
}