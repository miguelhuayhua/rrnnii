import Navbar from '../static/Navbar';
import { Box, Typography } from "@mui/material";
import '@/app/globals.scss';
import Footer from '../static/Footer';
import { Suspense } from 'react';
import Cliente from './Cliente';
export const metadata = {
    title: 'Videos - Relaciones Internacionales UPEA'
}
export default function Home() {
    return (
        <Box bgcolor='transparent'>
            <Navbar />
            <Box px={{ xs: 2, md: 10, lg: 20, xl: 35 }}>
                <Typography
                    variant='h1'
                    sx={{ fontWeight: 700, color: '#212b36', fontSize: 28, my: 3 }}
                >
                    Videos
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
