'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack } from "@mui/material";
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { BoxSombra, ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import ConvenioItem from "@/app/componentes/items/Convenio";
interface Props {
    value: Convenio & { ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { blue, red } from "@mui/material/colors";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [convenios, setConvenios] = useState([]);
    useEffect(() => {
        axios.post('/api/convenio/listar', { id: value.id }).then(res => {
            setConvenios(res.data);
        });
    }, []);
    return (
        <Grid container spacing={4} p={1}>
            <Grid item xs={12}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link color="inherit" href="/" >
                        Convocatorias
                    </Link>
                    <Link color="inherit" href="/convenios">
                        Convenios
                    </Link>
                    <Negrita sx={{ fontSize: 16 }}>
                        Ver
                    </Negrita>
                </Breadcrumbs>

            </Grid>
            <Grid item xs={12} md={8}>
                <ChipBox label={`Convenio ${value.tipo}`} sx={{ fontSize: 13, bgcolor: 'white', border: '1px solid #ddd' }} />
                <i style={{ float: 'right' }}>
                    <Normal sx={{ fontSize: 13 }}>
                        {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                    </Normal>
                </i>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} sm={8} mx='auto'>
                        <Image src={fileDomain + value.imagen}
                            objectFit="cover"
                            style={{ borderRadius: 10 }}
                            layout='responsive' width={100} height={80} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Image src={value.Institucion.logo ? fileDomain + value.Institucion.logo : '/default-image.jpg'}
                                objectFit="cover"
                                style={{ borderRadius: 10 }}
                                layout='fixed' width={50} height={50} />
                            <Box pl={1}>
                                <Negrita>
                                    {
                                        value.Institucion.nombre
                                    }
                                </Negrita>
                                {
                                    value.Institucion.contacto ?
                                        <Normal>
                                            {value.Institucion.contacto}
                                        </Normal> : null
                                }
                            </Box>
                        </Box>
                        <BoxSombra p={2}>
                            <Normal sx={{ fontSize: 12 }}>
                                Finaliza el: {dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                            </Normal>
                            <Normal sx={{ fontSize: 20, fontWeight: 600 }}>
                                {value.titulo}
                            </Normal>
                            <Box sx={{ fontSize: 14 }}>
                                {
                                    parse(value.descripcion)
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
                                            a.download = fileDomain + value.pdf;
                                            a.href = fileDomain + value.pdf;
                                            a.target = '_blank';
                                            a.click();
                                            a.remove();
                                        }}
                                        sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700], fontSize: 12 }}>
                                        Descargar documento
                                    </BotonFilled> : null
                            }
                        </BoxSombra>
                        <Stack direction='row' px={0.5} py={1} flexWrap='wrap'>
                            {
                                value.ConvenioCarrera.map(value =>
                                (<ChipBox
                                    sx={{ bgcolor: 'white', height: 35, borderRadius: 3 }}
                                    key={value.id} avatar={<Image src={value.Carrera.logo} width={25} height={25}
                                        layout='fixed' />} label={<Normal sx={{ fontSize: 13, ml: -1 }}>{value.Carrera.nombre}</Normal>} />)
                                )
                            }
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                <Titulo sx={{ textAlign: 'center', mb: 1 }}>
                    Más convenios
                </Titulo>
                <Grid container spacing={2}>
                    {
                        convenios.length == 0 ?
                            <Grid item xs={12} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más convenio disponibles</Normal>
                            </Grid> :
                            convenios.map((value: any) => (
                                <Grid key={value.id} item xs={10} sm={6} md={12} mx='auto'>
                                    <ConvenioItem value={value} />
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}