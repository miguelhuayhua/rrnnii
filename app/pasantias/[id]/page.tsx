import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Pasantia } from "@prisma/client";
import Cliente from "./Cliente";
import Footer from "@/app/static/Footer";
const get = async (id: string) => {
    return await prisma.pasantia.findUnique({
        where: { id },
        include: {
            Institucion: true,
            PasantiaCarrera: { include: { Carrera: true } }
        }
    });
}
export default async function Home(props: any) {
    const pasantias = await get(props.params.id) as Pasantia;
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Cliente value={pasantias as any} />
            <Footer />
        </Box>
    );
}
