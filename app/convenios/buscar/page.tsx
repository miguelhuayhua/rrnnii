import Cliente from './Cliente';
import Navbar from '../../static/Navbar';
import { Box, Typography, } from "@mui/material";
import Footer from '../../static/Footer';
import { Suspense } from 'react';
export const metadata = {
    title: 'Convenios - UPEA'
}
export default function Home() {
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Box px={{ xs: 2, md: 10, lg: 20, xl: 35 }}>
                <Typography
                    variant='h1'
                    sx={{ fontWeight: 700, color: '#212b36', fontSize: 28, my: 3 }}
                >
                    Convenios
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
