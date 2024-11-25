"use client";
import { Box, Grid, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Negrita, Normal } from '../componentes/Textos';
import dayjs from "dayjs";
import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import axios from 'axios';
import { Unidad } from '@prisma/client';
import { green, grey } from '@mui/material/colors';
import Link from 'next/link';
import { Button } from 'rsuite';
import { Icon } from '@iconify/react';
const Footer = () => {
    const [unidad, setUnidad] = useState<Unidad>();
    useEffect(() => {
        axios.post('/api/unidad/x').then(res => {
            setUnidad(res.data);
        });
    }, []);
    return (
        <Box component="footer" bgcolor={grey[900]} color={grey[200]} py={4} px={{ xs: 2, md: 8, lg: 16 }}>
            <Grid container spacing={4}>
                {/* Contact Information */}
                <Grid item xs={12} md={4}>
                    <Negrita variant="h6" sx={{ mb: 2 }}>
                        Contáctanos
                    </Negrita>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Icon icon='fluent-mdl2:cell-phone' fontSize={20} />
                        <Normal sx={{ ml: 1 }}>Teléfono: {unidad?.contacto}</Normal>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Icon icon='mage:email' fontSize={20} />
                        <Normal sx={{ ml: 1 }}>Correo: relaciones.internacionales@upea.bo</Normal>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Icon icon='mynaui:location' fontSize={20} />
                        <Normal sx={{ ml: 1 }}>
                            Ubicación: {unidad?.ubicacion}
                        </Normal>
                    </Box>

                </Grid>

                {/* Quick Links */}
                <Grid item xs={12} md={4}>
                    <Negrita variant="h6" sx={{ mb: 2 }}>
                        Enlaces rápidos
                    </Negrita>
                    <Box mt={2}>
                        <Link href="/about" style={{ textDecoration: 'none', color: grey[200] }}>
                            <Normal>Sobre Nosotros</Normal>
                        </Link>
                    </Box>
                    <Box mt={2}>
                        <Link href="/convenios" style={{ textDecoration: 'none', color: grey[200] }}>
                            <Normal>Convenios</Normal>
                        </Link>
                    </Box>
                    <Box mt={2}>
                        <Link href="/pasantias" style={{ textDecoration: 'none', color: grey[200] }}>
                            <Normal>Pasantías</Normal>
                        </Link>
                    </Box>
                    <Box mt={2}>
                        <Link href="/eventos" style={{ textDecoration: 'none', color: grey[200] }}>
                            <Normal>Eventos</Normal>
                        </Link>
                    </Box>

                </Grid>

                {/* Social Media */}
                <Grid item xs={12} md={4}>
                    <Negrita variant="h6" sx={{ mb: 2 }}>
                        Síguenos
                    </Negrita>
                    <Stack spacing={1} direction='row'>
                        <Button size='xs' appearance='link'>
                            <Icon fontSize={22} icon='ic:outline-facebook'
                                color='white' />
                        </Button>
                        <Button size='xs' appearance='link'>
                            <Icon color='white' icon='basil:instagram-solid' fontSize={22} />
                        </Button>
                        <Button size='xs' appearance='link'>
                            <Icon icon='mdi:youtube' fontSize={22}
                                color='white' />
                        </Button>
                        <Button appearance='link'>
                            <Icon
                                color='white'
                                icon='mage:whatsapp-filled' fontSize={22}
                            />
                        </Button>
                    </Stack>
                </Grid>

                {/* Footer Note */}
                <Grid item xs={12}>
                    <Normal sx={{ fontSize: 11, textAlign: 'center', pt: 3, color: grey[400] }}>
                        Desarrollado por Miguel Huayhua - UPEA {dayjs().year()}
                    </Normal>
                </Grid>
            </Grid>
        </Box>
    );
}
export default Footer;
