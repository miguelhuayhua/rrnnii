'use client';
import { BotonSimple } from "@/app/componentes/Botones";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Grid, Tabs } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowLeft } from "react-icons/md";
import parse from 'html-react-parser';
import { useForm } from "react-hook-form";
import { Beca, Institucion, ParticipanteBeca } from "@prisma/client";
import 'react-quill/dist/quill.snow.css';
import Image from 'next/legacy/image';
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TabBox } from "../../componentes/Mostrar";
import { IoCalendar } from "react-icons/io5";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { RiUserVoiceFill } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
interface Props {
    Beca: Beca & { Institucion: Institucion, Participantes: ParticipanteBeca[] };
}
dayjs.locale('es')
export default function Cliente({ Beca }: Props) {
    const { control, formState: { errors }, handleSubmit, setValue, watch } = useForm<Beca>({
        defaultValues: Beca, shouldFocusError: true
    });
    const { openSnackbar } = useSnackbar();
    const [opcion, setOpcion] = useState(1);
    const router = useRouter();

    return (
        <>
            <Box px={{ xs: 1, md: 2, lg: 5 }}>
                <BotonSimple
                    sx={{ mb: 2 }}
                    startIcon={<MdArrowLeft fontSize={20} />}
                    onClick={() => router.back()}>
                    Regresar
                </BotonSimple>
                <Breadcrumbs sx={{ mb: 1 }} >
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
                <Grid container spacing={2} pb={2}>
                    {
                        opcion == 1 ?
                            <>
                                <Grid item xs={12} md={6}>
                                    <BoxSombra sx={{ fontSize: 16, p: 2 }}>
                                        {
                                            parse(Beca.descripcion)
                                        }
                                    </BoxSombra>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BoxSombra p={2}>
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
                                    </BoxSombra>
                                    <BoxSombra mt={2} p={2} display='flex'>
                                        <Box>
                                            <Image
                                                src={Beca.Institucion.logo || '/default-image.jpg'} width={100} height={100}
                                                layout="fixed"
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
                                    </BoxSombra>
                                </Grid>
                            </> : null
                    }
                    {
                        opcion == 2 ?
                            <>
                                {
                                    Beca.Participantes.length > 0 ? <Grid container spacing={2}>
                                        {
                                            Beca.Participantes.map(value => (
                                                <Grid key={value.id} item xs={12} md={4}>
                                                    <BoxSombra>
                                                        <Avatar />
                                                        <Box>
                                                            <Negrita>
                                                                {value.nombre_completo}
                                                            </Negrita>
                                                            <Normal>
                                                                {value.contacto}
                                                            </Normal>
                                                        </Box>
                                                    </BoxSombra>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <Normal>Sin postulantes</Normal>
                                        </Grid>
                                }
                            </> : null
                    }

                </Grid>
            </Box>
        </>
    )
}