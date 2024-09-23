'use client';
import Navbar from './static/Navbar'
import Footer from './static/Footer'
import { BotonFilled } from './componentes/Botones'
import { useRouter } from 'next/navigation'
import { Box, Typography } from '@mui/material';

export default function NotFound() {
    const router = useRouter();
    return (
        <>
            <Navbar />
            <Box display='flex'
                py={10}
                flexDirection='column' alignItems='center'>
                <Typography variant='h1'
                    fontSize={60}
                    color='#212121'
                    fontWeight={900}
                >
                    404
                </Typography>
                <p style={{ fontSize: 20 }}>Página inexistente</p>
                <BotonFilled
                    onClick={() => {
                        router.replace('/');
                    }}
                >Volver a inicio</BotonFilled>
            </Box>
            <Footer />
        </>
    )
}