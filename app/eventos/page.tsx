import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Image from 'next/legacy/image';
export const metadata = {
    title: 'Eventos - Relaciones Internacionales UPEA'
}
export default function Home() {
    return (
        <Box bgcolor='white'>
            <Navbar />
            <Box sx={{ position: 'relative' }}>
                <Box width={"100%"} position='relative' height={350}>
                    <Image style={{ filter: 'brightness(.7)' }} src='/assets/portadaeventos.jpg' layout='fill' objectFit='cover' />
                </Box>
                <Box  >
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
                        Eventos
                    </Typography>
                    <Typography
                        sx={{
                            color: 'white',
                            position: 'absolute', top: 70,
                            width: "100%",
                            textAlign: 'center',
                            px: { xs: 2, sm: 5, md: 10, lg: 20 }
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
        </Box>
    );
}
