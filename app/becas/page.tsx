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
    title: 'Buscar Becas'
}
export default function Home() {
    return (
        <Box bgcolor='white'>
            <Navbar />
            <Box sx={{ position: 'relative' }}>
                <Box width={"100%"} position='relative' height={300}>
                    <Image style={{ filter: 'brightness(.7)' }} src='/assets/portadabeca.jpg' layout='fill' objectFit='cover' />
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
                        <Link style={{ textDecoration: 'none', color: 'white', fontSize: 13 }} href="/becas" >
                            Becas
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
                        Becas
                    </Typography>

                    <Typography
                        sx={{
                            color: '#bbb',
                            position: 'absolute', top: 70,
                            width: "100%",
                            textAlign: 'center',
                        }}
                    >
                        Las Becas están comprometidas con el proyecto educativo con el objetivo de facilitar recursos limitados y la capacidad intelectual.
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
