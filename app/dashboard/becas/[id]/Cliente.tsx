'use client';
import { BotonFilled, BotonOutline } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack, Tabs } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import parse from 'html-react-parser';
import { Beca, Institucion, ParticipanteBeca } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useState } from "react";
import { green, grey, red } from "@mui/material/colors";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TabBox } from "../../componentes/Mostrar";
import { IoCalendar } from "react-icons/io5";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { RiUserVoiceFill } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
import axios from "axios";
import { useModal } from "@/providers/ModalProvider";
import ParticipantesPDF from "./PDFPostulantes";
import { Button, Panel } from "rsuite";
import { pdf } from "@react-pdf/renderer";
import ModalParticipante from "./ModalParticipante";
import Tabla from "../../componentes/Tabla";
interface Props {
    Beca: Beca & { Institucion: Institucion, Participantes: ParticipanteBeca[] };
}
dayjs.locale('es')
export default function Cliente({ Beca }: Props) {
    const { openModal } = useModal();
    const { openSnackbar } = useSnackbar();
    const [open, setOpen] = useState<any>(null);
    const [opcion, setOpcion] = useState(1);
    const router = useRouter();
    const [participante, setParticipante] = useState<any>(null);
    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>

                <Button
                    appearance="subtle"
                    style={{ marginTop: 10 }}
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </Button>

                <Breadcrumbs sx={{ my: 2, mb: 4 }} >
                    <Link style={{ textDecoration: 'none' }} href="/dashboard">
                        <Normal>Principal</Normal>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} href="/dashboard/becas">
                        <Normal>Becas</Normal>
                    </Link>
                    <Negrita>{Beca.id}</Negrita>
                </Breadcrumbs>
                <Box position='relative'
                    mt={2}
                    height={300} borderRadius={3}
                    overflow='hidden'>
                    <Titulo
                        sx={{
                            color: 'white', zIndex: 100,
                            position: 'absolute', top: 20, left: 20
                        }}>
                        {Beca.titulo}
                    </Titulo>
                    <Image style={{ filter: 'brightness(0.3)' }} objectFit="cover"
                        src={fileDomain + Beca.imagen} layout="fill" />
                </Box>
                <Tabs
                    sx={{ mb: 2 }}
                    TabIndicatorProps={{ sx: { bgcolor: red[600] } }}
                    ScrollButtonComponent={(props) =>
                        <Button  {...props}>
                            {props.direction == 'left' ? <FaAngleLeft fontSize={15} /> : <FaAngleRight fontSize={15} />}
                        </Button>}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    value={opcion}
                    onChange={(_, value) => {
                        setOpcion(value);

                    }}  >
                    <TabBox label="Sobre la beca" value={1} />
                    <TabBox label={
                        <Box display='flex' alignItems='center'>
                            Postulantes
                            <ChipBox
                                sx={{ ml: 1, mb: 0.5, background: '#212121', color: 'white', height: 30 }}
                                label={Beca.Participantes.length} />
                        </Box>} value={2} />
                </Tabs>
                <Grid container spacing={4} pb={2}>
                    {
                        opcion == 1 ?
                            <>
                                <Grid item xs={12} md={6}>
                                    <Panel shaded style={{ fontSize: 16, background: 'white' }}>
                                        {
                                            parse(Beca.descripcion)
                                        }
                                    </Panel>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Panel shaded style={{ background: 'white' }}>
                                        <Box display={'flex'}>
                                            <IoCalendar style={{ fontSize: 23, color: 'black' }} />
                                            <Box ml={1}>
                                                <Normal>
                                                    Fecha de publicación
                                                </Normal>
                                                <Negrita>
                                                    {dayjs(Beca.createdAt).format('DD [de] MMMM [del] YYYY [a las] HH:mm:ss')}
                                                </Negrita>
                                            </Box>
                                        </Box>
                                        <Box display={'flex'} mt={2}>
                                            <IoCalendar style={{ fontSize: 23, color: 'black' }} />
                                            <Box ml={1}>
                                                <Normal>
                                                    Fecha de expiración
                                                </Normal>
                                                <Negrita>
                                                    {dayjs(Beca.termina, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                                                </Negrita>
                                            </Box>
                                        </Box>
                                        <Box display={'flex'} mt={2}>
                                            <RiUserVoiceFill style={{ fontSize: 23, color: 'black' }} />
                                            <Box ml={1}>
                                                <Normal>
                                                    Encargado
                                                </Normal>
                                                <Negrita>
                                                    {Beca.encargado || 'Sin asignar'}
                                                </Negrita>
                                            </Box>
                                        </Box>
                                    </Panel>
                                    <Panel shaded style={{
                                        background: 'white',
                                        marginTop: 30, display: 'flex'
                                    }}>                                        <Box>
                                            <Image
                                                src={Beca.Institucion.logo ? (fileDomain + Beca.Institucion.logo) : '/default-image.jpg'} width={100} height={100}
                                                layout="fixed"
                                                objectFit="cover"
                                                style={{ borderRadius: 10 }} />
                                        </Box>
                                        <Box p={2}>
                                            <Negrita>
                                                {Beca.Institucion.nombre}
                                            </Negrita>
                                            <Normal>
                                                {Beca.Institucion.ubicacion || 'Sin referencia'}
                                            </Normal>
                                            <Normal>
                                                {Beca.Institucion.contacto || 'Sin contacto'}
                                            </Normal>
                                        </Box>
                                    </Panel>
                                </Grid>
                            </> : null
                    }
                    {
                        opcion == 2 ?
                            <>
                                {
                                    Beca.Participantes.length > 0 ?
                                        <Grid mt={2} container spacing={2} mx={2} >
                                            <Grid item xs={12}>
                                                <Stack direction='row' spacing={2}>
                                                    <Button appearance='ghost'
                                                        size='md'
                                                        onClick={() => {
                                                            pdf(<ParticipantesPDF
                                                                Beca={Beca}
                                                                Participantes={Beca.Participantes}
                                                            />).toBlob().then(res => {
                                                                let url = URL.createObjectURL(res);
                                                                let a = document.createElement('a');
                                                                a.download = "participantes-beca-" + Beca.id;
                                                                a.href = url;
                                                                a.click();
                                                                a.remove();
                                                            });
                                                        }}
                                                    >
                                                        Generar listado
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Tabla data={Beca.Participantes.map(value => (
                                                    {
                                                        Nombre: value.nombre_completo,
                                                        "Registro Universitario": value.ru,
                                                        "Cédula de Identidad": value.ci,
                                                        "": (
                                                            <Stack direction='row' spacing={1} py={1}>
                                                                <Button appearance='primary' style={{ background: grey[900] }}>
                                                                    <Icon icon="carbon:phone-filled" />
                                                                </Button>
                                                                <Button appearance='primary' style={{ background: red[600] }}
                                                                    onClick={() => {
                                                                        let a = document.createElement('a');
                                                                        a.href = fileDomain + value.cipath;
                                                                        a.target = '_blank';
                                                                        a.download = fileDomain + value.cipath;
                                                                        a.click();
                                                                        a.remove();
                                                                        openSnackbar('Carnet descargado con éxito');
                                                                    }}
                                                                >
                                                                    CI
                                                                </Button>
                                                                <Button appearance='primary'
                                                                    onClick={() => {
                                                                        let a = document.createElement('a');
                                                                        a.href = fileDomain + value.rupath;
                                                                        a.target = '_blank';
                                                                        a.download = fileDomain + value.rupath;
                                                                        a.click();
                                                                        a.remove();
                                                                        openSnackbar('Registro universitario descargado con éxito');
                                                                    }}
                                                                    style={{ background: red[600] }}>
                                                                    RU
                                                                </Button>
                                                            </Stack>)
                                                    }
                                                ))} />
                                            </Grid>
                                            {
                                                Beca.Participantes.map((value, index) => (
                                                    <Grid key={value.id} item xs={12} sm={6} lg={4}>
                                                        <BoxSombra position='relative' p={2}>
                                                            {
                                                                value.aceptado ?
                                                                    <Stack spacing={2} direction='row'
                                                                        sx={{ position: 'absolute', top: 10, right: 15 }}>
                                                                        <Box>
                                                                            <Icon icon="lets-icons:done-round-duotone"
                                                                                fontSize={35}
                                                                                style={{
                                                                                    color: green[500],
                                                                                    marginTop: 10
                                                                                }} />
                                                                        </Box>
                                                                        <Button onClick={() => {
                                                                            setParticipante(value);
                                                                        }}>
                                                                            <Icon icon="material-symbols:edit-outline"
                                                                                fontSize={25}
                                                                                style={{ color: grey[500] }} />
                                                                        </Button>
                                                                    </Stack> :
                                                                    <Stack
                                                                        sx={{ mb: 2 }}
                                                                        direction='row' spacing={1} >
                                                                        <BotonOutline
                                                                            sx={{ height: 30, fontSize: 13 }}
                                                                            onClick={() => {
                                                                                openModal({
                                                                                    titulo: '¿Está seguro?',
                                                                                    content: 'El postulante será rechazado',
                                                                                    async callback() {
                                                                                        let res = await axios.post('/api/beca/participante/rechazar', { id: value.id });
                                                                                        router.refresh();
                                                                                        return res.data.mensaje;
                                                                                    }
                                                                                })
                                                                            }}
                                                                        >
                                                                            Rechazar
                                                                        </BotonOutline>
                                                                        <BotonFilled
                                                                            sx={{ height: 30, fontSize: 13 }}
                                                                            onClick={() => {
                                                                                openModal({
                                                                                    titulo: '¿Está seguro?',
                                                                                    content: 'El postulante quedará registrado en la beca',
                                                                                    async callback() {
                                                                                        let res = await axios.post('/api/beca/participante/aceptar', { id: value.id });
                                                                                        router.refresh();
                                                                                        return res.data.mensaje;
                                                                                    }
                                                                                })
                                                                            }}>
                                                                            Aceptar
                                                                        </BotonFilled>
                                                                    </Stack>
                                                            }

                                                        </BoxSombra>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <Negrita sx={{ textAlign: 'center', mt: 3 }}>
                                                La beca aún no cuenta con participantes
                                            </Negrita>
                                        </Grid>
                                }
                            </> : null
                    }

                </Grid>
            </Box>
            {
                participante ?
                    <ModalParticipante Participante={participante} setParticipante={setParticipante} />
                    : null
            }
        </>
    )
}