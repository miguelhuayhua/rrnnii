'use client';
import { Negrita, Normal, Titulo } from "@/app/componentes/Textos";
import { Box, Breadcrumbs, Grid, Stack } from "@mui/material";
import { Carrera, Institucion, Pasantia, PasantiaCarrera } from "@prisma/client";
import Image from 'next/legacy/image';
import parse from 'html-react-parser';
import Link from "next/link";
import { ChipBox } from "@/app/componentes/Mostrar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { red, grey } from "@mui/material/colors";
import { Icon } from '@iconify/react';
import { fileDomain } from "@/utils/globals";
import { FaBuildingColumns } from "react-icons/fa6";
import { Button, Panel, Tabs } from "rsuite";
import { compartirEnFacebook, compartirEnlaceEnWhatsApp, compartirEnX } from "@/utils/data";
interface Props {
    value: Pasantia & { PasantiaCarrera: (PasantiaCarrera & { Carrera: Carrera })[], Institucion: Institucion };
}
dayjs.extend(require('dayjs/plugin/customParseFormat'));
export default function Cliente({ value }: Props) {
    const [pasantias, setPasantias] = useState([]);
    useEffect(() => {
        axios.post('/api/pasantia/listar', { id: value.id }).then(res => {
            setPasantias(res.data);
        });
    }, []);
    return (
        <>
            <Grid container>
                <Grid item xs={12} mb={4}>
                    <Box sx={{ height: { xs: 500, md: 450 }, position: 'relative' }}>
                        <Box sx={{
                            position: 'absolute',
                            width: "80%",
                            right: 0, left: 0, margin: 'auto',
                            zIndex: 10,
                            height: "100%",
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Titulo sx={{
                                fontSize: 32,
                                fontWeight: 600,
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                {value.titulo}
                            </Titulo>
                            <Normal sx={{
                                mt: 5,
                                textAlign: 'center',
                                color: 'white', fontSize: 17
                            }}>
                                {value.titulo}
                            </Normal>
                            <Box p={2} position='relative' display='flex' mt={2}>
                                <Box sx={{ background: '#FFFFFF66', height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} />
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Image
                                        layout="fixed"
                                        width={30}
                                        height={30}
                                        style={{ borderRadius: "50%" }}
                                        src={value.Institucion.logo ? fileDomain + value.Institucion.logo : '/default-image.jpg'} />
                                    <Normal sx={{ ml: 1, fontSize: 18, color: 'white' }}>
                                        {value.Institucion.nombre}
                                    </Normal>

                                </Box>
                                <Box bgcolor={red[50]} ml={4} p={2} borderTop={`5px solid ${red[700]}`}>
                                    <Normal sx={{ color: 'black' }}>
                                        Finaliza
                                    </Normal>
                                    <Negrita sx={{ color: 'black' }}>
                                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD MMM YYYY')}
                                    </Negrita>
                                </Box>
                            </Box>
                            <Breadcrumbs
                                color="white" sx={{
                                    position: 'absolute', bottom: 10,
                                    color: 'white', alignItems: 'center'
                                }} separator="＞" aria-label="breadcrumb">
                                <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/" >
                                    <Icon icon='lucide:home' style={{ marginTop: 6 }} />
                                </Link>,
                                <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/pasantias" >
                                    Pasantías
                                </Link>
                                <Normal sx={{ color: 'white', fontSize: 13 }}>
                                    {value.titulo}
                                </Normal>
                            </Breadcrumbs>
                        </Box>
                        <Zoom>
                            <Image
                                style={{ filter: 'brightness(0.6)' }}
                                src={fileDomain + value.imagen} layout="fill" objectFit="cover" />
                        </Zoom>
                    </Box>
                </Grid>
                <Grid item xs={12} md={9} px={{ xs: 2, sm: 5, md: 10, lg: 20 }}>
                    <Normal sx={{ color: grey[700], fontWeight: 300 }}>
                        Publicado el {dayjs(value.createdAt).format('DD [de] MMMM [del] YYYY')}
                    </Normal>
                    <Negrita sx={{ fontSize: 30, mt: 3 }}>
                        Detalles
                    </Negrita>
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
                </Grid>
                <Grid item xs={0} md={3} display={{ xs: 'none', md: 'block' }} >
                    <Box px={1} position='sticky' top={90} bottom={0}>
                        <Stack spacing={2}>
                            <Link
                                target='_blank'
                                href={`https://wa.me/591${value.Institucion.contacto}`}>
                                <Button block
                                    appearance="primary" size='lg'>
                                    Contactarme
                                </Button>
                            </Link>
                        </Stack>

                        <Stack spacing={0.1} direction='row'
                            height="100%" mt={4}
                            alignItems='center' justifyContent='center'>
                            <Normal>
                                Compartir:
                            </Normal>
                            <Button style={{ display: 'flex', alignItems: 'center' }}
                                onClick={() => {
                                    compartirEnFacebook(`https://rrnnii.upea.bo/pasantias/${value.id}`);
                                }}
                                size='xs' appearance='link'>
                                <Icon icon='ic:outline-facebook' fontSize={20} />
                            </Button>
                            <Button appearance='link' onClick={() => {
                                compartirEnlaceEnWhatsApp(`https://rrnnii.upea.bo/pasantias/${value.id}`,
                                    'Mira esta Pasantía disponible'
                                )
                            }}>
                                <Icon icon='mage:whatsapp-filled' fontSize={20} />
                            </Button>
                            <Button onClick={() => {
                                compartirEnX(`https://rrnnii.upea.bo/pasantias/${value.id}`, 'Mira esta Pasantía disponible')
                            }} size='xs' appearance='link'>
                                <Icon icon='fa6-brands:x-twitter' fontSize={16} />
                            </Button>

                        </Stack>

                    </Box>
                </Grid>
            </Grid>
            <Grid container my={4}>
                <Grid item xs={4} mx='auto'>
                    <Stack alignItems='center' my={2}>
                        <Icon fontSize={50} icon='carbon:time' />
                        <Negrita mt={1}>
                            {value.modalidad == 'more' ?
                                'Más de 6 meses' :
                                value.modalidad + " Meses"}
                        </Negrita>
                    </Stack>
                </Grid>
                <Grid item xs={4} mx='auto'>
                    <Stack alignItems='center' my={2}>
                        <Icon fontSize={50} icon='fluent:shifts-availability-20-regular' />
                        <Negrita mt={1}>
                            {value.estado ?
                                'Vigente' :
                                'No disponible'}
                        </Negrita>
                    </Stack>
                </Grid>
                <Grid item xs={4} mx='auto'>
                    <Stack alignItems='center' my={2}>
                        <Icon fontSize={50} icon='mage:eye' />
                        <Negrita mt={1}>
                            {value.conteo} Visitas
                        </Negrita>
                    </Stack>
                </Grid>
                <Grid item xs={12} my={6}>
                    <Negrita sx={{ fontSize: 32, textAlign: 'center' }}>
                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('DD [de] MMMM [del] YYYY')}
                    </Negrita>
                    <Normal sx={{ textAlign: 'center' }}>
                        Conclusión de la convocatoria
                    </Normal>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ mx: { xs: 0, sm: 10, lg: 25 }, mt: 2 }}>

                        <Tabs defaultActiveKey="1"

                            style={{ border: 'none' }}
                            vertical appearance="subtle">
                            <Tabs.Tab eventKey="1" title="Institución">
                                <Box display='flex' flexDirection='column'
                                    alignItems='center' justifyContent='center'
                                    py={3}>
                                    <Image
                                        layout="fixed"
                                        width={100}
                                        height={100}
                                        style={{ borderRadius: "50%" }}
                                        src={value.Institucion.logo ? fileDomain + value.Institucion.logo : '/default-image.jpg'} />
                                    <Negrita mt={2}>
                                        {value.Institucion.nombre}
                                    </Negrita>
                                    {
                                        value.Institucion.contacto ?
                                            <Normal sx={{
                                                display: 'flex',
                                                my: 2,
                                                alignItems: 'center'
                                            }}>
                                                <Icon icon='si:phone-line'
                                                    fontSize={22} style={{ marginRight: 10 }} />
                                                {value.Institucion.contacto}
                                            </Normal> : null
                                    }
                                    {
                                        value.Institucion.web ?
                                            <Normal sx={{
                                                display: 'flex',
                                                my: 1,
                                                alignItems: 'center'
                                            }}>
                                                <Icon icon="pepicons-pencil:internet"
                                                    fontSize={20} style={{ marginRight: 10 }} />
                                                <Link
                                                    href={value.Institucion.web!} target='_blank'>
                                                    {value.Institucion.web}
                                                </Link>
                                            </Normal>
                                            : null
                                    }
                                    {
                                        value.Institucion.video ?
                                            <Box component='iframe'
                                                sx={{
                                                    width: "80%",
                                                    border: 'none', borderRadius: 4,
                                                    height: { xs: 200, sm: 300 },
                                                    maxWidth: 500, mt: 2
                                                }}
                                                src={"https://www.youtube.com/embed/" + value.Institucion.video?.split('=')[1]}
                                                title="Video institucional" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            /> :
                                            null
                                    }

                                </Box>
                            </Tabs.Tab>
                            <Tabs.Tab eventKey="2" title="Fechas">
                                <Box display='flex' flexDirection='column'
                                    alignItems='center' justifyContent='center'
                                    py={3} px={1}>

                                    <Titulo sx={{ textAlign: 'center', fontWeight: 500 }}>
                                        {dayjs(value.createdAt).format('[Del] DD [de] MMMM YYYY [-]')}
                                        {dayjs(value.finalizacion, 'DD/MM/YYYY').format('[Hasta el] DD [de] MMMM YYYY')}
                                    </Titulo>

                                </Box>
                            </Tabs.Tab>
                            <Tabs.Tab eventKey="3" title="Carreras">
                                <Box py={1}>
                                    <Stack direction='row' flexWrap='wrap'>
                                        {
                                            value.PasantiaCarrera.map(value =>
                                            (<ChipBox
                                                key={value.id}
                                                label={<Normal sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontWeight: 700 }}>
                                                    {value.Carrera.logo ?
                                                        <Image src={fileDomain + value.Carrera.logo}
                                                            width={30} height={30} style={{ borderRadius: 4 }}
                                                            layout='fixed' /> : <FaBuildingColumns fontSize={15} />}
                                                    <span style={{ marginLeft: 5 }}>
                                                        {value.Carrera.nombre}
                                                    </span></Normal>} />)
                                            )
                                        }
                                    </Stack>
                                </Box>
                            </Tabs.Tab>
                        </Tabs>
                        {
                            value.pdf ?
                                <Box px={{ xs: 2, sm: 5, md: 10, lg: 15, xl: 20 }}>
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
                                            Documento de convocatoria
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
                <Grid item xs={12} pb={2}
                    px={{ xs: 3, sm: 10 }}>
                    <Titulo sx={{ textAlign: 'center', my: 6 }}>
                        Más pasantías
                    </Titulo>
                    {
                        pasantias.length == 0 ?
                            <Grid item xs={12} >
                                <Normal sx={{ textAlign: 'center' }}>No se encontraron más pasantias disponibles</Normal>
                            </Grid> :
                            pasantias.map((value: Pasantia) => (
                                <Grid key={value.id} item xs={12} my={2}>
                                    <Link style={{
                                        textDecoration: 'none'
                                    }} href={`/pasantias/${value.id}`}>
                                        <Negrita sx={{ color: red[600], textAlign: 'center' }}>
                                            {value.titulo}
                                        </Negrita>
                                    </Link>
                                </Grid>
                            ))
                    }
                </Grid>
            </Grid >
            <Box sx={{
                position: 'fixed', bottom: 0, width: "100%",
                bgcolor: 'white',
                display: { xs: 'block', md: 'none' },
                zIndex: 100
            }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Link
                            target='_blank' style={{ borderRadius: 0 }}
                            href={`https://wa.me/591${value.Institucion.contacto}`}>
                            <Button block style={{ borderRadius: 0 }}
                                appearance="primary" size='lg'>
                                Contactarme
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={0.1} direction='row'
                            height="100%"
                            alignItems='center' justifyContent='center'>
                            <Normal>
                                Compartir:
                            </Normal>
                            <Button style={{ display: 'flex', alignItems: 'center' }}
                                onClick={() => {
                                    compartirEnFacebook(`https://rrnnii.upea.bo/pasantias/${value.id}`);
                                }}
                                size='xs' appearance='link'>
                                <Icon icon='ic:outline-facebook' fontSize={20} />
                            </Button>
                            <Button appearance='link' onClick={() => {
                                compartirEnlaceEnWhatsApp(`https://rrnnii.upea.bo/pasantias/${value.id}`,
                                    'Mira esta Pasantía disponible'
                                )
                            }}>
                                <Icon icon='mage:whatsapp-filled' fontSize={20} />
                            </Button>
                            <Button onClick={() => {
                                compartirEnX(`https://rrnnii.upea.bo/pasantias/${value.id}`, 'Mira esta Pasantía disponible')
                            }} size='xs' appearance='link'>
                                <Icon icon='fa6-brands:x-twitter' fontSize={16} />
                            </Button>

                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}