import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Image from 'next/legacy/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';
export const metadata = {
    title: 'Eventos - Relaciones Internacionales UPEA'
}
export default function Home() {
    return (
        <>
            <Navbar />
            <Box sx={{ position: 'relative' }}>
                <Box width={"100%"} position='relative' height={350}>
                    <Image style={{ filter: 'brightness(.7)' }} src='/assets/portadaeventos.jpg' layout='fill' objectFit='cover' />
                    <Breadcrumbs
                        color="white" sx={{
                            position: 'absolute', bottom: 10,
                            color: 'white',
                            width: "100%", display: 'flex',
                            justifyContent: 'center'
                        }} separator="＞" aria-label="breadcrumb">
                        <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/" >
                            <Icon icon='lucide:home' style={{ marginTop: 7 }} />
                        </Link>,
                        <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/eventos" >
                            Eventos
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box  >
                    <Typography
                        variant='h1'
                        sx={{
                            fontWeight: 700,
                            color: 'white', fontSize: 30,
                            position: 'absolute', top: 40,
                            width: "100%",
                            textAlign: 'center'
                        }}
                    >
                        Eventos
                    </Typography>
                    <Typography
                        sx={{
                            color: 'white',
                            position: 'absolute', top: 90,
                            width: "100%",
                            textAlign: 'center',
                            px: { xs: 2, sm: 10, md: 20, lg: 30, xl: 50 }
                        }}
                    >
                        La Unidad de Relaciones Internacionales de la UPEA organiza eventos que promueven la internacionalización, como ferias de movilidad, conferencias, talleres y convenios académicos, fortaleciendo el intercambio cultural y académico.
                    </Typography>
                    <Suspense>
                        <Cliente />
                    </Suspense>
                </Box>
            </Box>
            <Box mt={10}>
                <Footer />
            </Box>
        </>
    );
}
