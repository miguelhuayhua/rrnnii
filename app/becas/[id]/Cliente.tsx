'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Beca, Institucion } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import EventoItem from "@/app/componentes/items/Evento";
interface Props {
    value: Beca & { Institucion: Institucion };
}
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line, RiUserReceivedFill } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [becas, setEventos] = useState([]);
    useEffect(() => {
        axios.post('/api/evento/listar', { id: value.id }).then(res => {
            setEventos(res.data);
        });
    }, []);
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{ height: 500, position: 'relative' }}>
                    <Titulo sx={{
                        position: 'absolute',
                        fontSize: 30,
                        top: 40,
                        pl: { xs: 2, sm: 6, xl: 40 },
                        zIndex: 10, color: 'white'
                    }}>
                        {value.titulo}
                    </Titulo>
                    <Box alignItems='center' zIndex={10} display='flex' pl={{ xs: 2, sm: 6, xl: 40 }} position='absolute' bottom={40}>
                        <Avatar sx={{ width: 60, height: 60 }} />
                        <Box ml={2}>
                            <Negrita sx={{ fontSize: 18, color: 'white' }}>
                                {value.Institucion.nombre}
                            </Negrita>
                            <Normal sx={{ color: '#ddd' }}>
                                {dayjs(value.createdAt).format('DD MMMM YYYY')}
                            </Normal>
                        </Box>
                    </Box>
                    <Box position='absolute' bottom={20} right={30}>
                        <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
                    <Image
                        style={{ filter: 'brightness(0.3)' }}
                        src={fileDomain + value.imagen} layout="fill" objectFit="cover" />
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box borderBottom='1px solid #ddd' py={4}>
                    <Breadcrumbs sx={{
                        px: { xs: 1, sm: 5, lg: 25 },
                    }} separator="•" aria-label="breadcrumb">
                        <Link style={{ textDecoration: 'none' }} href="/" >
                            Convocatorias
                        </Link>,
                        <Link style={{ textDecoration: 'none' }} href="/becas" >
                            Eventos
                        </Link>,
                        <Negrita sx={{ fontSize: 16 }}>
                            {value.titulo}
                        </Negrita>
                    </Breadcrumbs>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Box sx={{ fontSize: 17, px: { xs: 1, sm: 10, lg: 25 }, mt: 2 }}>
                    <BotonFilled startIcon={<RiUserReceivedFill />}>
                        Postular beca
                    </BotonFilled>
                    {
                        value.descripcion ? parse(value.descripcion) :
                            <Normal>Sin descripción</Normal>
                    }
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Titulo sx={{ textAlign: 'center', mb: 2 }}>
                    Más becas
                </Titulo>
                <Grid container spacing={2}>
                    {
                        becas.length == 0 ?
                            <Grid item xs={12} sm={6} md={4} xl={3} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más becas disponibles</Normal>
                            </Grid> :
                            becas.map((value: any) => (
                                <Grid key={value.id} item xs={12} sm={6} md={4} lg={3} mx='auto'>
                                    <EventoItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}
