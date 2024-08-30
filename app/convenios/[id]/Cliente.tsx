'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Divider, Grid, Stack } from "@mui/material";
import { Carrera, Convenio, ConvenioCarrera } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import ConvenioItem from "@/app/componentes/items/Convenio";
interface Props {
    value: Convenio & { ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[] };
}
export default function Cliente({ value }: Props) {
    const [convenios, setConvenios] = useState([]);
    useEffect(() => {
        axios.post('/api/convenio/listar', { skip: 1 }).then(res => {
            setConvenios(res.data);
        })
    }, []);
    return (
        <Grid container spacing={4} p={3}>
            <Grid item xs={12}>
                <Breadcrumbs sx={{ mb: 4 }} separator="›" aria-label="breadcrumb">
                    <Link color="inherit" href="/" >
                        Actividades
                    </Link>,
                    <Link
                        color="inherit"
                        href="/material-ui/getting-started/installation/"
                    >
                        Convenios
                    </Link>,
                    <Negrita sx={{ fontSize: 16 }}>
                        Ver
                    </Negrita>
                </Breadcrumbs>

            </Grid>
            <Grid item xs={12} md={7}>
                <ChipBox label={`Convenio ${value.tipo}`} sx={{ fontSize: 13, bgcolor: 'white', border: '1px solid #ddd' }} />
                <i style={{ float: 'right' }}>
                    <Normal sx={{ fontSize: 12 }}>
                        {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                    </Normal>
                </i>
                <Grid container spacing={2}>
                    <Grid item xs={6} mx='auto'>
                        <Image src={value.imagen}
                            objectFit="cover"
                            style={{ borderRadius: 10 }}
                            layout='responsive' width={100} height={80} />
                    </Grid>
                    <Grid item xs={12} p={3}>
                        <Box position='relative'>
                            <Normal sx={{ fontSize: 12 }}>
                                Finaliza el: {dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                            </Normal>
                            <Normal sx={{ fontSize: 20, fontWeight:600 }}>
                                {value.titulo}
                            </Normal>
                            {
                                parse(value.descripcion)
                            }
                        </Box>
                        <Divider sx={{ borderColor: '#eee' }}></Divider>
                        <Stack direction='row' px={0.5} py={1} flexWrap='wrap'>
                            {
                                value.ConvenioCarrera.map(value =>
                                (<ChipBox
                                    sx={{ bgcolor: 'white', height: 45, borderRadius: 3 }}
                                    key={value.id} avatar={<Image src={value.Carrera.logo} width={25} height={25}
                                        layout='fixed' />} label={<Normal sx={{ fontSize: 13, ml: -1 }}>{value.Carrera.nombre}</Normal>} />)
                                )
                            }
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <Titulo sx={{ textAlign: 'center' }}>
                    Más convenios
                </Titulo>
                <Grid container spacing={2}>
                    {
                        convenios.length == 0 ?
                            <Grid item xs={12} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más convenio disponibles</Normal> :
                            </Grid> :
                            convenios.map((value: any) => (
                                <Grid key={value.id} item xs={10} mx='auto'>
                                    <ConvenioItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}