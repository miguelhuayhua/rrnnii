import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { Convenio } from "@prisma/client";
import Cliente from "./Cliente";
import Footer from "@/app/static/Footer";
import { notFound } from "next/navigation";
const get = async (id: string) => {
    return await prisma.convenio.findUnique({
        where: { id },
        include: {
            Institucion: true,
            ConvenioCarrera: { include: { Carrera: true } }
        }
    });
}
export const generateMetadata = async (props: any): Promise<Metadata> => {
    const convenio = await get(props.params.id) as Convenio;
    if (!convenio) return notFound();
    return ({ title: convenio.titulo })
}
export default async function Home(props: any) {
    const convenio = await get(props.params.id) as Convenio;
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Cliente value={convenio as any} />
            <Footer />
        </Box>
    );
}
