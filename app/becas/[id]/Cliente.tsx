'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Avatar, Box, Breadcrumbs, Button, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Beca, Institucion } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
interface Props {
    value: Beca & { Institucion: Institucion };
}
dayjs.extend(require('dayjs/plugin/customParseFormat'));
import 'dayjs/locale/es';
import { BotonFilled } from "@/app/componentes/Botones";
import { TbPdf } from "react-icons/tb";
import { RiFileWord2Line, RiUserReceivedFill } from "react-icons/ri";
import { fileDomain } from "@/utils/globals";
import { blue, green, red } from "@mui/material/colors";
import { IoMdCalendar } from "react-icons/io";
import { ChipBox } from "@/app/componentes/Mostrar";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import BecaItem from "@/app/componentes/items/Beca";
import ModalInscribir from "./ModalInscribit";
import ModalInstitucion from "@/app/componentes/ModalInstitucion";
dayjs.locale('es');
export default function Cliente({ value }: Props) {
    const [becas, setBecas] = useState([]);
    const [openModalInstitucion, setOpenModalInstitucion] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        axios.post('/api/beca/listar', { id: value.id }).then(res => {
            setBecas(res.data);
        });
    }, []);
    return (
        <>
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
                                <Button
                                    sx={{ px: 0, mx: 0, minWidth: 0 }}
                                    variant="text" onClick={() => {
                                        setOpenModalInstitucion(true);
                                    }}>
                                    <Negrita sx={{ fontSize: 18, color: 'white' }}>
                                        {value.Institucion.nombre}
                                    </Negrita>
                                </Button>
                                <Normal sx={{ color: '#ddd' }}>
                                    {dayjs(value.createdAt).format('DD MMMM YYYY')}
                                </Normal>
                            </Box>
                        </Box>
                        <Box position='absolute' bottom={20} right={30}>
                            <SpeedDial
                                ariaLabel="SpeedDial basic example"
                                sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1 }}
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
                                Becas
                            </Link>,
                            <Negrita sx={{ fontSize: 16 }}>
                                {value.titulo}
                            </Negrita>
                        </Breadcrumbs>
                    </Box>
                </Grid>
                <Grid item xs={12} >
                    <Box
                        position='relative'
                        sx={{ fontSize: 17, mx: { xs: 1, sm: 10, lg: 25 }, mt: 2 }}>
                        <BotonFilled
                            onClick={() => {
                                setOpen(true);
                            }}
                            sx={{ mb: 2 }} startIcon={<RiUserReceivedFill />}>
                            Postular beca
                        </BotonFilled>
                        <Normal
                            sx={{
                                display: 'flex',
                                alignItems: 'center', color: '#777'
                            }}>
                            <IoMdCalendar style={{ marginRight: 5, fontSize: 22 }} />
                            {dayjs(value.termina, 'DD/MM/YYYY').format('[Finaliza el] DD [de] MMMM [del] YYYY')}
                        </Normal>
                        <ChipBox
                            sx={{
                                height: 30,
                                position: 'absolute', top: 6, right: 0,
                                background: dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0 ? green[400] : red[400],
                                color: 'white'
                            }}
                            label={dayjs(value.termina, 'DD/MM/YYYY').diff(dayjs()) > 0 ? 'Vigente' : 'Concluído'} />
                        {
                            value.descripcion ? parse(value.descripcion) :
                                <Normal>Sin descripción</Normal>
                        }
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
                    <Titulo sx={{ textAlign: 'center', my: 3 }}>
                        Más becas
                    </Titulo>
                    <Grid container spacing={2} px={{ xs: 5, sm: 10, md: 15 }} >
                        {
                            becas.length == 0 ?
                                <Grid item xs={12} >
                                    <Normal sx={{ textAlign: 'center' }}>No se encontraron más convenio disponibles</Normal>
                                </Grid> :
                                becas.map((value: any) => (
                                    <Grid key={value.id} item xs={12} sm={6} lg={4} xl={3} mx='auto'>
                                        <BecaItem value={value} />
                                    </Grid>
                                ))
                        }
                    </Grid>
                </Grid>
            </Grid >
            <ModalInscribir becaId={value.id} open={open} setOpen={setOpen} />
            <ModalInstitucion Institucion={value.Institucion} open={openModalInstitucion}
                setOpen={setOpenModalInstitucion}
            />
        </>
    )
}
