
import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box, Typography, Container, Grid } from "@mui/material";
const get = async (id: string) => {
    return await prisma.convenio.findUnique({ where: { id } });
}
export default function Home(props: any) {
    console.log(props)
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Box p={3}>
                <Typography variant='h1' sx={{ fontWeight: 700, color: '#212b36', fontSize: 18 }}>Convenios</Typography>
            </Box>
        </Box>
    );
}
