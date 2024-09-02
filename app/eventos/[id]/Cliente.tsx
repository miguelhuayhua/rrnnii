'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid } from "@mui/material";
import { Evento } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import EventoItem from "@/app/componentes/items/Evento";
interface Props {
    value: Evento;
}
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line } from "react-icons/ri";
import { blue, red } from "@mui/material/colors";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [eventos, setEventos] = useState([]);
    useEffect(() => {
        axios.post('/api/evento/listar', { id: value.id }).then(res => {
            setEventos(res.data);
        });
    }, []);
    return (
        <Grid container spacing={4} p={3}>
            <Grid item xs={12}>
                <Breadcrumbs sx={{ mb: 4 }} separator="›" aria-label="breadcrumb">
                    <Link color="inherit" href="/" >
                        Convocatorias
                    </Link>,
                    <Link
                        color="inherit"
                        href="/eventos"
                    >
                        Eventos
                    </Link>,
                    <Negrita sx={{ fontSize: 16 }}>
                        Ver
                    </Negrita>
                </Breadcrumbs>

            </Grid>
            <Grid item xs={12} md={7}>
                <ChipBox label={`Evento ${value.tipo}`} sx={{ fontSize: 13, bgcolor: 'white', border: '1px solid #ddd' }} />
                <i style={{ float: 'right' }}>
                    <Normal sx={{ fontSize: 12 }}>
                        {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                    </Normal>
                </i>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={10} sm={8} md={7} lg={6} mx='auto'>
                        <Image src={value.imagen}
                            objectFit="cover"
                            style={{ borderRadius: 10 }}
                            layout='responsive' width={100} height={80} />
                    </Grid>
                    <Grid item xs={12}>
                        <BoxSombra p={2}>
                            <Normal sx={{ fontSize: 12, mb: 1 }}>
                                Inicia el: {dayjs(value.inicio, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                            </Normal>
                            <Normal sx={{ fontSize: 20, fontWeight: 600 }}>
                                {value.titulo}
                            </Normal>
                            <Box sx={{ fontSize: 14 }}>
                                {
                                    value.descripcion ? parse(value.descripcion) :
                                        <Normal>Sin descripción</Normal>
                                }
                            </Box>
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
                                            a.download = value.pdf;
                                            a.href = value.pdf;
                                            a.click();
                                            a.remove();
                                        }}
                                        sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700], fontSize: 12 }}>
                                        Descargar documento
                                    </BotonFilled> : null
                            }
                        </BoxSombra>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <Titulo sx={{ textAlign: 'center', mb: 2 }}>
                    Más eventos
                </Titulo>
                <Grid container spacing={2}>
                    {
                        eventos.length == 0 ?
                            <Grid item xs={12} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más eventos disponibles</Normal>
                            </Grid> :
                            eventos.map((value: any) => (
                                <Grid key={value.id} item xs={11} sm={6} md={10} lg={6} mx='auto'>
                                    <EventoItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}