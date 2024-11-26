'use client';
import { Box, Breadcrumbs, Link, Stack, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { BotonFilled, BotonOutline, BotonSimple } from "@/app/componentes/Botones";
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
import { blue, red } from "@mui/material/colors";
import { ChipBox } from "@/app/componentes/Mostrar";
import { Button } from "rsuite";
export default function Main() {
    const [opcion, setOpcion] = useState('todo');
    const { openSnackbar } = useSnackbar();
    const [Personas, setPersonas] = useState<any>([]);
    const [prevPersonas, setPrevPersonas] = useState<Persona[]>([]);
    const [Persona, setPersona] = useState<any>(null);
    const [personaId, setPersonaId] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        axios.post('/api/persona/todo').then(res => {
            setPersonas(res.data);
            setPrevPersonas(res.data);
        });
    }, [opcion, Persona]);
    return (
        <Box px={{ xs: 1, md: 2, lg: 5 }} >
            <Breadcrumbs sx={{ my: 2 }} >
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
                <Button
                    size='lg' appearance='primary' onClick={() => router.push('/dashboard/usuarios/crear')}>
                    Añadir Personal
                </Button>
                <Button size='lg' appearance='subtle' onClick={() => {
                    axios.post('/api/persona/todo').then(res => {
                        setPersonas(res.data);
                        setPrevPersonas(res.data);
                        setOpcion('todo');
                    });
                }}>
                    <TbReload fontSize={22} />
                </Button>
            </Stack>
            <Tabs
                sx={{ mb: 2, background: 'white', borderRadius: 3, boxShadow: '2px 2px 8px #21212122' }}
                TabIndicatorProps={{ sx: { bgcolor: red[700] } }}
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
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Todos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 25 }}
                            label={prevPersonas.length} />
                    </Box>}
                    value='todo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Activos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPersonas.filter(value => value.estado).length} />
                    </Box>} value='activo' />
                <TabBox label={
                    <Box display='flex' alignItems='center'>
                        Inactivos
                        <ChipBox
                            sx={{ ml: 1, mb: 0.5, height: 25 }}
                            label={prevPersonas.filter(value => !value.estado).length} />
                    </Box>} value='inactivo' />
            </Tabs>
            <Tabla
                hasPagination
                skipColumns={{ nombre: true }}
                data={Personas.map((value: Persona) => (
                    {
                        CI: value.ci,
                        "Datos personales": `${value.nombre} ${value.paterno} ${value.materno}`,
                        "Creado el": (
                            <Box minWidth={90} py={1}>
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
                                    <Button appearance='ghost'
                                        size='sm' style={{ fontSize: 13 }}
                                        onClick={() => { setPersona(value) }}
                                    >
                                        Modificar
                                    </Button>
                                    <Button
                                        appearance='ghost'
                                        size='sm'
                                        onClick={() => {
                                            setPersonaId(value.id);
                                        }}>
                                        <FaUser />
                                    </Button>
                                    <SwitchBox checked={value.estado}
                                        onChange={(ev, checked) => {
                                            axios.post('/api/persona/estado', { estado: checked, id: value.id }).then(res => {
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
                personaId ?
                    <ModalUsuario
                        personaId={personaId}
                        setPersonaId={setPersonaId}
                    /> : null
            }
        </Box>
    )
}