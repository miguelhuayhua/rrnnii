import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box } from "@mui/material";
import '@/app/globals.scss';
import Footer from '../static/Footer';
import { Suspense } from 'react';
export const metadata = {
    title: 'Sobre la unidad'
}
export default function Home() {
    return (
        <Box bgcolor='transparent' position='relative'>
            <Navbar />
            <Suspense>
                <Cliente />
            </Suspense>

            <Footer />
        </Box>
    );
}
