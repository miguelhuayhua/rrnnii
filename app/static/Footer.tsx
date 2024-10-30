"use client";
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Normal } from '../componentes/Textos';
import dayjs from "dayjs";
import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import axios from 'axios';
import { Unidad } from '@prisma/client';

const Footer = () => {
    const [unidad, setUnidad] = useState<Unidad>();
    useEffect(() => {
        axios.post('/api/unidad/x').then(res => {
            setUnidad(res.data);
        });
    }, []);
    return (
        <>
            <Grid container component='footer'
                px={{ xs: 1, md: 5, lg: 16 }} py={4}
                borderTop='1px solid #ddd'
            >
                <Grid xs={6}>
                    <BsPhone fontSize={30} color='#888' />
                    <Normal variant='body1' sx={{ fontSize: 14 }}>
                        Ubicación: {unidad?.ubicacion}
                    </Normal>
                    <Normal variant='body1' sx={{ fontSize: 14 }}>
                        Celular:  {unidad?.contacto}
                    </Normal>

                </Grid>
                <Grid xs={6}>
                    <CiMail fontSize={30} color='#888' />
                    <Normal variant='body1' sx={{ fontSize: 14 }}>
                        Correo: {unidad?.email}
                        <br />
                        relaciones.internacionales@upea.bo
                    </Normal>
                </Grid>
                <Grid item xs={12}>
                    <Normal sx={{ fontSize: 10, pt: 5, textAlign: 'center' }}>
                        Desarrollado por Miguel Huayhua - UPEA {dayjs().year()}
                    </Normal>
                </Grid>
            </Grid>
        </>
    )
}
export default Footer;
