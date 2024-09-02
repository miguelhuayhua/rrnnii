import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';

export default function Home() {
    return (
        <>
            <Navbar />
            <Box p={3}>
                <Typography variant='h1' sx={{ fontWeight: 800, fontSize: 20 }}>Galeria</Typography>
            </Box >
            <Suspense >
                <Cliente />
            </Suspense>
            <Box mt={10}>
                <Footer />
            </Box>
        </>
    );
}
