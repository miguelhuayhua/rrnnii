import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Cliente from './Cliente';
import '@/app/globals.scss';
import Image from 'next/legacy/image';
import { Metadata } from 'next';
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
