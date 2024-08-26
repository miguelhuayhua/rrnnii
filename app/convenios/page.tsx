import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Typography, } from "@mui/material";
import Footer from '../static/Footer';
export default function Home() {
    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f2f2f2' }}>
                <Box p={3}>
                    <Typography variant='h1' sx={{ fontWeight: 800, fontSize: 20 }}>Convenios</Typography>
                </Box>
                <Cliente />
            </Box>
            <Box mt={10}>
                <Footer />
            </Box>
        </>
    );
}
