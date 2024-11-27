import Navbar from '../static/Navbar';
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Cliente from './Cliente';
import '@/app/globals.scss';
import Image from 'next/legacy/image';
import { Metadata } from 'next';
import { Icon } from '@iconify/react';
import Link from 'next/link';
export const metadata: Metadata = {
    title: 'Buscar Becas - UPEA'
}
export default function Home() {
    return (
        <>
            <Navbar />
            <Box sx={{ position: 'relative' }}>
                <Box width={"100%"} position='relative' height={350}>
                    <Image
                        src='/assets/portadabeca.jpg'
                        layout='fill'
                        objectFit='cover'
                        alt="Imagen representativa de becas"  // Añadir descripción accesible a la imagen
                        style={{ filter: 'brightness(.7)' }}
                    />
                    <Breadcrumbs
                        color="white"
                        sx={{
                            position: 'absolute',
                            bottom: 10,
                            color: 'white',
                            width: "100%",
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        separator="＞"
                        aria-label="Breadcrumb navigation"  // Descripción accesible para los breadcrumbs
                    >
                        <Link
                            style={{ textDecoration: 'none', color: 'white', fontSize: 13 }}
                            href="/"
                            aria-label="Ir al inicio"  // Descripción accesible para el enlace de inicio
                        >
                            <Icon icon='lucide:home' style={{ marginTop: 7 }} />
                        </Link>,
                        <Link
                            style={{ textDecoration: 'none', color: 'white', fontSize: 13 }}
                            href="/becas"
                            aria-label="Ver página de becas"  // Descripción accesible para el enlace de becas
                        >
                            Becas
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box bgcolor='transparent'>
                    <Typography
                        variant='h1'
                        sx={{
                            fontWeight: 700,
                            color: 'white',
                            fontSize: 30,
                            position: 'absolute',
                            top: 40,
                            width: "100%",
                            textAlign: 'center'
                        }}
                        aria-label="Título de la sección Becas"  // Añadir un label para el título
                    >
                        Becas
                    </Typography>

                    <Typography
                        sx={{
                            color: 'white',
                            position: 'absolute',
                            top: 100,
                            width: "100%",
                            textAlign: 'center',
                            px: { xs: 2, sm: 10, md: 20, lg: 30, xl: 50 }
                        }}
                        aria-label="Descripción de las becas ofrecidas"  // Añadir un label para la descripción
                    >
                        La Unidad de Relaciones Internacionales de la UPEA ofrece oportunidades de becas para estudiantes destacados, promoviendo su desarrollo académico y profesional a través de financiamiento y convenios estratégicos.
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
