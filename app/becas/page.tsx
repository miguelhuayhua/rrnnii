import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Cliente from './Cliente';
export default function Home() {
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Box p={2}>
                <Typography
                    variant='h1'
                    sx={{ fontWeight: 700, color: '#212b36', fontSize: 18, mb: 3 }}
                >
                    Becas
                </Typography>
                <Suspense>
                    <Cliente />
                </Suspense>
            </Box>
            <Box mt={10}>
                <Footer />
            </Box>
        </Box>
    );
}
