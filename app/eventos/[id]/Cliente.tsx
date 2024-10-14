'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from "@mui/material";
import { Evento } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import EventoItem from "@/app/componentes/items/Evento";
interface Props { value: Evento; }
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line } from "react-icons/ri";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { blue, grey, red } from "@mui/material/colors";
import { fileDomain } from "@/utils/globals";
import { IoMdCalendar } from "react-icons/io";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [eventos, setEventos] = useState([]);
    useEffect(() => {
        axios.post('/api/evento/listar', { id: value.id, take: 4 }).then(res => {
            setEventos(res.data);
        });
    }, []);
    return (
        <Grid container>
            <Grid item xs={12} md={9} pb={4}>
                <Box sx={{ height: 500, position: 'relative' }}>
                    <Stack sx={{
                        position: 'absolute', top: 20, zIndex: 10,
                        mx: { xs: 2, sm: 6, xl: 10 }, alignItems: 'center'
                    }} direction='row' spacing={2}>
                        <ChipBox label={`Modalidad: ${value.tipo}`}
                            sx={{
                                bgcolor: grey[900], color: 'white',
                            }} />
                        <Normal sx={{
                            color: '#bbb', mb: 2,
                        }}>
                            {dayjs(value.createdAt).format('DD MMMM YYYY')}
                        </Normal>
                    </Stack>

                    <Titulo sx={{
                        position: 'absolute',
                        fontSize: 30,
                        top: 60,
                        mx: { xs: 2, sm: 6, xl: 10 },
                        zIndex: 10, color: 'white'
                    }}>
                        {value.titulo}
                    </Titulo>

                    <Box pr={{ xs: 2, sm: 6, xl: 10 }}
                        zIndex={11}
                        position='absolute' bottom={50} right={0}>
                        <SpeedDial
                            ariaLabel="Mas"
                            icon={<SpeedDialIcon />}
                        >   {
                                value.pdf ?
                                    <SpeedDialAction
                                        onClick={() => {
                                            let a = document.createElement('a');
                                            a.download = fileDomain + value.pdf;
                                            a.href = fileDomain + value.pdf;
                                            a.target = '_blank';
                                            a.click();
                                            a.remove();
                                        }}
                                        sx={{ background: 'white' }}
                                        icon={value.pdf.includes('pdf') ?
                                            <TbPdf fontSize={22} />
                                            : <RiFileWord2Line fontSize={22} />}
                                        tooltipTitle={'Descargar archivo'}
                                    />
                                    : null
                            }
                        </SpeedDial>
                    </Box>
                    <Zoom>
                        <Image
                            style={{ filter: 'brightness(0.3)', background: grey[900] }}
                            src={fileDomain + value.imagen} layout="fill" objectFit="cover" />
                    </Zoom>
                </Box>
                <Grid item xs={12} >
                    <Box borderBottom='1px solid #ddd' py={4}>
                        <Breadcrumbs sx={{
                            px: { xs: 1, sm: 5, md: 10 },
                        }} separator="•" aria-label="breadcrumb">
                            <Link style={{ textDecoration: 'none' }} href="/" >
                                Convocatorias
                            </Link>,
                            <Link style={{ textDecoration: 'none' }} href="/eventos" >
                                Eventos
                            </Link>,
                            <Negrita sx={{ fontSize: 16 }}>
                                {value.titulo}
                            </Negrita>
                        </Breadcrumbs>
                    </Box>
                </Grid>
                <Box sx={{ fontSize: 17, mx: { xs: 1, sm: 10 }, mt: 4 }} position='relative'>
                    <Normal
                        sx={{
                            display: 'flex',
                            alignItems: 'center', color: '#777', mb: 2
                        }}>
                        <IoMdCalendar style={{ marginRight: 5, fontSize: 22 }} />
                        {dayjs(value.inicio, 'DD/MM/YYYY').format('[Inicia el] DD [de] MMMM [del] YYYY')}
                    </Normal>

                    {
                        value.descripcion ? parse(value.descripcion) :
                            <Normal>Sin descripción</Normal>
                    }
                    {
                        value.pdf ?
                            <BotonFilled
                                startIcon={
                                    value.pdf.includes('pdf') ?
                                        <TbPdf fontSize={22} />
                                        : <RiFileWord2Line fontSize={22} />
                                }
                                onClick={() => {
                                    let a = document.createElement('a');
                                    a.download = fileDomain + value.pdf;
                                    a.href = fileDomain + value.pdf;
                                    a.target = '_blank';
                                    a.click();
                                    a.remove();
                                }}
                                sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700], mt: 4 }}>
                                Descargar documento
                            </BotonFilled> : null
                    }
                </Box>
            </Grid>
            <Grid item xs={12} md={3} borderLeft='1px solid #ddd'
                pb={4}
                px={{ xs: 6, sm: 4, md: 1, lg: 3, xl: 8 }}>
                <Titulo sx={{ textAlign: 'center', mt: { xs: 3, md: 0 }, mb: 3 }}>
                    Más eventos
                </Titulo>
                <Grid container spacing={2}>
                    {
                        eventos.length == 0 ?
                            <Grid item xs={6} sm={12} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más eventos disponibles</Normal>
                            </Grid> :
                            eventos.map((value: any) => (
                                <Grid key={value.id} item xs={12} sm={6} md={12} mx='auto'>
                                    <EventoItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>

        </Grid >
    )
}