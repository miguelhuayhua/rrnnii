"use client";
import Image from 'next/legacy/image';
import AppBar from '@mui/material/AppBar';
import { Button, styled, ButtonProps, Tooltip, useScrollTrigger, Typography, Grid, Stack, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { FaAngleDown } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { GoDotFill } from "react-icons/go";
import { Normal } from '../componentes/Textos';
import dayjs from "dayjs";

import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
//estilos


const Footer = () => {
    const pathname = usePathname();
    const trigger = useScrollTrigger({
        threshold: 0,
        disableHysteresis: true
    });
    const [y, setY] = useState(0);
    const onScroll = useCallback(() => {
        const { scrollY } = window;
        setY(scrollY)

    }, []);
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);
    return (
        <>
            <Grid container component='footer' px={{ xs: 1, md: 5, lg: 16 }}>
                <Grid xs={6}>
                    <BsPhone fontSize={30} color='#888' />
                    <Normal variant='body1'>
                        Teléfono: 2844177
                    </Normal>
                    <Normal variant='body1'>
                        Celular:  76567636-70670980
                    </Normal>
                    <Normal variant='body1'>
                        Fax: {`(591-2) 2845800`}
                    </Normal>
                </Grid>
                <Grid xs={6}>
                    <CiMail fontSize={30} color='#888' />
                    <Normal variant='body1'>
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
