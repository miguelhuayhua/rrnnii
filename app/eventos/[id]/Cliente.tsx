'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack } from "@mui/material";
import { Evento, Unidad } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { Icon } from '@iconify/react';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
interface Props { value: Evento; }
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { grey, red } from "@mui/material/colors";
import { fileDomain } from "@/utils/globals";
import { Button, Panel } from "rsuite";
import { compartirEnFacebook, compartirEnlaceEnWhatsApp, compartirEnX } from "@/utils/data";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [eventos, setEventos] = useState([]);
    const [unidad, setUnidad] = useState<Partial<Unidad>>();
    useEffect(() => {
        axios.post('/api/evento/listar', { id: value.id, take: 4 }).then(res => {
            setEventos(res.data);
        });
        axios.post('/api/unidad/x').then(res => {
            setUnidad(res.data);
        })
    }, []);
    return (
        <Grid container
            spacing={3}>
            <Grid item xs={12} md={5}>
                <Zoom>
                    <Image
                        style={{ filter: 'brightness(0.6)', zIndex: 0 }}
                        src={fileDomain + value.imagen}
                        width={100} height={40}
                        layout="responsive" objectFit="cover" />
                </Zoom>
                <Box position='sticky'
                    top={66}
                    bgcolor={grey[100]}
                    py={4}
                    px={{ xs: 1, sm: 5, md: 10, lg: 15 }} >
                    <Breadcrumbs
                        sx={{
                            py: 2, zIndex: 20,
                            alignItems: 'center'
                        }} separator="＞" aria-label="breadcrumb">
                        <Link style={{
                            textDecoration: 'none',
                            fontSize: 13
                        }} href="/" >
                            <Icon icon='lucide:home' style={{ marginTop: 8 }} fontSize={15} />
                        </Link>,
                        <Link style={{ textDecoration: 'none', fontSize: 13 }} href="/eventos" >
                            Eventos
                        </Link>
                        <Normal sx={{ fontSize: 13 }}>
                            {value.titulo}
                        </Normal>
                    </Breadcrumbs>
                    <Titulo sx={{
                        fontSize: 30,
                        zIndex: 10,
                        fontWeight: 700, mb: 4
                    }}>
                        {value.titulo}
                    </Titulo>
                    <Box display='flex' alignItems='center'>
                        <Icon icon='mynaui:calendar' fontSize={30} />
                        <Box ml={2}>
                            <Negrita sx={{ fontSize: 17 }}>
                                ¿Cuándo inicia?
                            </Negrita>
                            <Normal sx={{ fontWeight: 300, mt: 0.5 }}>
                                {dayjs(value.inicio, 'DD/MM/YYYY').format('[Inicia el] DD [de] MMMM [del] YYYY')}
                            </Normal>
                        </Box>
                    </Box>
                    <Box display='flex' alignItems='center' mt={2}>
                        <Icon icon='bytesize:location' fontSize={30} />
                        <Box ml={2}>
                            <Negrita sx={{ fontSize: 17 }}>
                                {value.tipo == 'online' ? '¿Cuál es el enlace?' : '¿Dónde está ubicado?'}
                            </Negrita>
                            {value.tipo == 'online' ?
                                <Link target="_blank" href={value.link!}>
                                    {value.link}</Link>
                                : <Normal sx={{ fontWeight: 300, mt: 0.5 }}>
                                    {value.ubicacion}
                                </Normal>}

                        </Box>
                    </Box>
                    <Button
                        block
                        size='lg'
                        appearance="primary"
                        onClick={() => {
                            const encodedMessage = encodeURIComponent('Solicito mayor información sobre el evento: ' + value.titulo);
                            const whatsappUrl = `https://wa.me/591${unidad?.contacto}?text=${encodedMessage}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        style={{
                            background: grey[900],
                            marginTop: 30,
                            padding: "17px"
                        }}>
                        Necesito Ayuda
                    </Button>
                    <Normal sx={{ mt: 4 }}>
                        Comparte el evento:
                    </Normal>
                    <Stack spacing={0.1} direction='row' mt={2}>
                        <Button style={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => {
                                compartirEnFacebook(`https://rrnnii.upea.bo/eventos/${value.id}`);
                            }}
                            size='xs' appearance='link'>
                            <Icon icon='ic:outline-facebook' fontSize={28} />
                        </Button>
                        <Button appearance='link' onClick={() => {
                            compartirEnlaceEnWhatsApp(`https://rrnnii.upea.bo/eventos/${value.id}`,
                                'Mira esta Eventos disponible'
                            )
                        }}>
                            <Icon icon='mage:whatsapp-filled' fontSize={28} />
                        </Button>
                        <Button onClick={() => {
                            compartirEnX(`https://rrnnii.upea.bo/eventos/${value.id}`, 'Mira esta Evento disponible')
                        }} size='xs' appearance='link'>
                            <Icon icon='fa6-brands:x-twitter' fontSize={24} />
                        </Button>
                    </Stack>
                </Box>

            </Grid>
            <Grid item xs={12} md={7}>
                <Box
                    sx={{ fontSize: 17, pl: 2, pr: { xs: 2, md: 10, lg: 15, xl: 20 } }} position='relative'>
                    {
                        value.descripcion ?
                            <Box sx={{
                                fontSize: 17.5, fontWeight: 300,
                                textAlign: 'justify',
                                p: {
                                    color: grey[900],
                                },
                                "h2, h3, h4": { color: red[500] },
                                li: {
                                    listStyleType: 'square', "::marker": {
                                        color: red[500], fontSize: 25
                                    }
                                }
                            }}>
                                {
                                    parse(value.descripcion)
                                }
                            </Box> :
                            <Normal>Sin descripción</Normal>
                    }
                    {
                        value.pdf ?
                            <Box>
                                <Panel bordered
                                    style={{
                                        marginTop: 40,
                                    }}
                                >
                                    <Negrita sx={{
                                        fontSize: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 3
                                    }}>
                                        <Icon icon='mdi-light:file'
                                            fontSize={35} />
                                        Documento de respaldo
                                    </Negrita>
                                    <Button
                                        style={{ background: grey[900] }}
                                        onClick={() => {
                                            let a = document.createElement('a');
                                            a.download = fileDomain + value.pdf;
                                            a.href = fileDomain + value.pdf;
                                            a.target = '_blank';
                                            a.click();
                                            a.remove();
                                        }}
                                        appearance="primary" size='lg'>
                                        Ver documento
                                    </Button>
                                </Panel>
                            </Box> : null
                    }
                </Box>
            </Grid>
            <Grid item xs={12} pb={6}
                px={{ xs: 3, sm: 10 }}>
                <Titulo sx={{ textAlign: 'center', my: 4 }}>
                    Más eventos
                </Titulo>
                {
                    eventos.length == 0 ?
                        <Grid item xs={12} >
                            <Normal sx={{ textAlign: 'center' }}>No se encontraron más eventos disponibles</Normal>
                        </Grid> :
                        eventos.map((value: Evento) => (
                            <Grid key={value.id} item xs={12} my={2}>
                                <Link style={{
                                    textDecoration: 'none'
                                }} href={`/eventos/${value.id}`}>
                                    <Negrita sx={{ color: red[600], textAlign: 'center' }}>
                                        {value.titulo}
                                    </Negrita>
                                </Link>
                            </Grid>
                        ))
                }
            </Grid>

        </Grid >
    )
}