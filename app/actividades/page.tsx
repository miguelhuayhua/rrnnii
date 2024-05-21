import Cliente from './Cliente';
import Navbar from '../static/Navbar';
import { Box, Typography, Container, Grid } from "@mui/material";
import Footer from '../static/Footer';
export default function Home() {
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Box p={3}>
                <Typography variant='h1' sx={{ fontWeight: 700, color: '#212b36', fontSize: 18 }}>Actividades</Typography>
            </Box>
            <Cliente />
            <Box mt={10}>
                <Footer />
            </Box>
        </Box>
    );
}
