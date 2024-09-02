"use client";
import { useScrollTrigger, Grid } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Normal } from '../componentes/Textos';
import dayjs from "dayjs";
import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';

const Footer = () => {
    return (
        <>
            <Grid container component='footer' px={{ xs: 1, md: 5, lg: 16 }} py={4}>
                <Grid xs={6}>
                    <BsPhone fontSize={30} color='#888' />
                    <Normal variant='body1' sx={{ fontSize: { xs: 11, md: 14, lg: 16 } }}>
                        Teléfono: 2844177
                    </Normal>
                    <Normal variant='body1' sx={{ fontSize: { xs: 11, md: 14, lg: 16 } }}>
                        Celular:  76567636-70670980
                    </Normal>
                    <Normal variant='body1' sx={{ fontSize: { xs: 11, md: 14, lg: 16 } }}>
                        Fax: {`(591-2) 2845800`}
                    </Normal>
                </Grid>
                <Grid xs={6}>
                    <CiMail fontSize={30} color='#888' />
                    <Normal variant='body1' sx={{ fontSize: { xs: 11, md: 14, lg: 16 } }}>
                        Correo: camposugartevictor@gmail.com
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
