import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Footer from '../static/Footer';
import Image from 'next/legacy/image';
import { Suspense } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
export const metadata = {
    title: 'Pasantías - UPEA'
}
export default function Home() {
    return (
        <Box bgcolor='white'>
            <Navbar />
            <Box sx={{ position: 'relative' }}>
                <Box width={"100%"} position='relative' height={350}>
                    <Image style={{ filter: 'brightness(.7)' }} src='/assets/portadapasantia.jpg' layout='fill' objectFit='cover' />
                    <Breadcrumbs
                        color="white" sx={{
                            position: 'absolute', bottom: 10,
                            color: 'white',
                            width: "100%", display: 'flex',
                            justifyContent: 'center'
                        }} separator="＞" aria-label="breadcrumb">
                        <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/" >
                            <Icon icon='lucide:home' style={{ marginTop: 7 }} />
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/pasantias" >
                            Pasantías
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box >
                    <Typography
                        variant='h1'
                        sx={{
                            fontWeight: 700,
                            color: 'white', fontSize: 30,
                            position: 'absolute', top: 20,
                            width: "100%",
                            textAlign: 'center'
                        }}
                    >
                        Pasantías
                    </Typography>
                    <Typography
                        sx={{
                            position: 'absolute', top: 70,
                            width: "100%",
                            textAlign: 'center',
                            px: { xs: 2, sm: 5, md: 10, lg: 20 },
                            color: 'white'
                        }}
                    >
                        La Unidad de Relaciones Internacionales de la UPEA gestiona pasantías que permiten a los estudiantes adquirir experiencia práctica, fortalecer sus habilidades y aplicar sus conocimientos en entornos profesionales.
                    </Typography>
                    <Suspense>
                        <Cliente />
                    </Suspense>
                </Box>
            </Box>
            <Box mt={10}>
                <Footer />
            </Box>
        </Box>
    );
}
