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
        <>
            <Navbar />
            <Box >
                <Suspense>
                    <Cliente />
                </Suspense>
            </Box>

            <Box mt={10}>
                <Footer />
            </Box>
        </>
    );
}
