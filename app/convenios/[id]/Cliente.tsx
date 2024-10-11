'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Button, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from "@mui/material";
import { Carrera, Convenio, ConvenioCarrera, Institucion } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Icon as Iconify } from '@iconify/react';
import axios from "axios";
import { IoMdCalendar } from "react-icons/io";
import ConvenioItem from "@/app/componentes/items/Convenio";
interface Props {
    value: Convenio & { ConvenioCarrera: (ConvenioCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { blue, green, grey, red } from "@mui/material/colors";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
import { MdPhone } from "react-icons/md";
import { FaBuildingColumns, FaRotate } from "react-icons/fa6";
import ModalInstitucion from "@/app/componentes/ModalInstitucion";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [convenios, setConvenios] = useState([]);
    const [openModalInstitucion, setOpenModalInstitucion] = useState(false);
    useEffect(() => {
        axios.post('/api/convenio/listar', { id: value.id }).then(res => {
            setConvenios(res.data);
        });
    }, []);
    return (
        <>
            <Grid container >
                <Grid item xs={12}>
                    <Box sx={{ height: 500, position: 'relative' }}>
                        <Stack sx={{
                            position: 'absolute', top: 20, zIndex: 10,
                            mx: { xs: 2, sm: 6, xl: 40 },
                        }} direction='row' spacing={2}>
                            <ChipBox label={value.tipo == 'internacional' ? 'Convenio internacional' : 'Convenio nacional'}
                                sx={{
                                    bgcolor: grey[900], color: 'white',

                                }} />
                            <Normal sx={{
                                display: 'flex',
                                color: '#ddd',
                                alignItems: 'center',
                            }}>
                                <Iconify fontSize={30} style={{ marginRight: 5, borderRadius: 10 }} icon={`flag:${value.tipo == 'nacional' ? 'bo' : value.pais.toLowerCase()}-4x3`} />
                                {value.tipo == 'nacional' ? 'BO' : value.pais}
                            </Normal>
                        </Stack>
                        <Titulo sx={{
                            position: 'absolute',
                            fontSize: 30,
                            top: 60,
                            mx: { xs: 2, sm: 6, xl: 40 },
                            zIndex: 10, color: 'white'
                        }}>
                            {value.titulo}
                        </Titulo>
                        <Box alignItems='center' zIndex={10} display='flex' pl={{ xs: 2, sm: 6, xl: 40 }} position='absolute' bottom={40}>
                            <Avatar sx={{ border: '1px solid #333', height: 70, width: 70 }}
                                src={value.Institucion.logo ? fileDomain + value.Institucion.logo : ''} />
                            <Box ml={2}>
                                <Button
                                    sx={{ px: 0, mx: 0, minWidth: 0 }}
                                    variant="text" onClick={() => {
                                        setOpenModalInstitucion(true);
                                    }}>
                                    <Negrita sx={{ fontSize: 18, color: 'white' }}>
                                        {value.Institucion.nombre}
                                    </Negrita>
                                </Button>
                                <Normal sx={{ color: '#bbb' }}>
                                    {dayjs(value.createdAt).format('DD MMMM YYYY')}
                                </Normal>
                                <Normal sx={{ color: '#bbb', display: 'flex', alignItems: 'center' }}>
                                    <MdPhone style={{ marginRight: 5 }} />
                                    {value.Institucion.contacto || 'Sin número'}
                                </Normal>
                            </Box>
                        </Box>
                        <Box pr={{ xs: 2, sm: 6, xl: 40 }}
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
                                style={{ filter: 'brightness(0.3)' }}
                                src={fileDomain + value.imagen} layout="fill" objectFit="cover" />

                        </Zoom>
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
                                Convenios
                            </Link>,
                            <Negrita sx={{ fontSize: 16 }}>
                                {value.titulo}
                            </Negrita>
                        </Breadcrumbs>
                    </Box>
                </Grid>
                <Grid item xs={12}  >
                    <Box sx={{ fontSize: 17, mx: { xs: 1, sm: 10, lg: 25 }, mt: 2 }} position='relative'>
                        <Normal
                            sx={{
                                display: 'flex',
                                alignItems: 'center', color: '#777'
                            }}>
                            <IoMdCalendar style={{ marginRight: 5, fontSize: 22 }} />
                            {dayjs(value.finalizacion, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                        </Normal>
                        <ChipBox
                            sx={{ height: 30, position: 'absolute', top: -7, right: 0, background: dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0 ? green[400] : red[400], color: 'white' }}
                            label={dayjs(value.finalizacion, 'DD/MM/YYYY').diff(dayjs()) > 0 ? 'Vigente' : 'Concluído'} />
                        {
                            value.descripcion ? parse(value.descripcion) :
                                <Normal>Sin descripción</Normal>
                        }
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ mx: { xs: 1, sm: 10, lg: 25 }, mt: 2 }}>
                        <Negrita>Disponible para:</Negrita>
                        <Stack direction='row' py={2} flexWrap='wrap'>
                            {
                                value.ConvenioCarrera.map(value =>
                                (<ChipBox
                                    key={value.id}
                                    label={<Normal sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontWeight: 700 }}>
                                        {value.Carrera.logo ?
                                            <Image src={fileDomain + value.Carrera.logo}
                                                width={20} height={20} style={{ borderRadius: 4 }}
                                                layout='fixed' /> : <FaBuildingColumns fontSize={15} />}
                                        <span style={{ marginLeft: 5 }}>
                                            {value.Carrera.nombre}
                                        </span></Normal>} />)
                                )
                            }
                        </Stack>
                        {
                            value.pdf ?
                                <>

                                    <Normal mb={2}>
                                        <i>Archivos adjuntos</i>
                                    </Normal>
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
                                                sx={{ background: value.pdf.includes('pdf') ? red[700] : blue[700] }}>
                                                Descargar documento
                                            </BotonFilled> : null
                                    }</> : null
                        }
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <Titulo sx={{ textAlign: 'center', my: 1 }}>
                        Más convenios
                    </Titulo>
                    <Grid container spacing={2} px={{ xs: 2, sm: 5, md: 10 }} >
                        {
                            convenios.length == 0 ?
                                <Grid item xs={12} >
                                    <Normal sx={{ textAlign: 'center' }}>No se encontraron más convenio disponibles</Normal>
                                </Grid> :
                                convenios.map((value: any) => (
                                    <Grid key={value.id} item xs={12} sm={6} lg={4} xl={3} mx='auto'>
                                        <ConvenioItem value={value} />
                                    </Grid>
                                ))
                        }
                    </Grid>
                </Grid>
                /</Grid >
            <ModalInstitucion Institucion={value.Institucion}
                open={openModalInstitucion} setOpen={setOpenModalInstitucion} />
        </>
    )
}