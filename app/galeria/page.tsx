import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';

export default function Home() {
    return (
        <>
            <Navbar />
            <Box p={2}>
                <Typography variant='h1' sx={{ fontWeight: 800, fontSize: 20, mb: 3 }}>
                    Galeria
                </Typography>
                <Suspense >
                    <Cliente />
                </Suspense>
            </Box >
            <Box mt={10}>
                <Footer />
            </Box>
        </>
    );
}
