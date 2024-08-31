'use client';
import ActividadItem from "@/app/componentes/items/Actividad";
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid } from "@mui/material";
import { Actividad } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import Image from 'next/legacy/image';
import Link from "next/link";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
interface Props {
    value: Actividad;
}
const Cliente = ({ value }: Props) => {
    const [actividads, setActividads] = useState([]);
    useEffect(() => {
        axios.post('/api/actividad/listar', { skip: 1 }).then(res => {
            setActividads(res.data);
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
                        href="/actividades"
                    >
                        Actividades
                    </Link>,
                    <Negrita sx={{ fontSize: 16 }}>
                        Ver
                    </Negrita>
                </Breadcrumbs>

            </Grid>
            <Grid item xs={12} md={7}>
                <ChipBox label={`${value.tipo.toUpperCase()}`} sx={{ fontSize: 13, bgcolor: 'white', border: '1px solid #ddd' }} />
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
                    <Grid item xs={12}>
                        <BoxSombra p={2}>
                            <Normal sx={{ fontSize: 20, fontWeight: 600 }}>
                                {value.titulo}
                            </Normal>
                            <Box sx={{ fontSize: 14 }}>
                                {
                                    parse(value.descripcion)
                                }
                            </Box>
                        </BoxSombra>

                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <Titulo sx={{ textAlign: 'center' }}>
                    Más actividades
                </Titulo>
                <Grid container spacing={2}>
                    {
                        actividads.length == 0 ?
                            <Grid item xs={12} >
                                <Normal sx={{ textAlign: 'center' }}>
                                    No se encontraron más actividades disponibles
                                </Normal>
                            </Grid> :
                            actividads.map((value: any) => (
                                <Grid key={value.id} item xs={10} mx='auto'>
                                    <ActividadItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}
export default Cliente;