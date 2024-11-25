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

const incrementarVista = async (id: string) => {
    await prisma.convenio.update({ where: { id }, data: { conteo: { increment: 1 } } })
}


export const generateMetadata = async (props: any): Promise<Metadata> => {
    const convenio = await get(props.params.id) as Convenio;
    if (!convenio) return notFound();
    return ({ title: convenio.titulo })
}

export default async function Home({ params }: any) {
    const convenio = await get(params.id) as Convenio;
    if (convenio) {
        await incrementarVista(params.id);
        return (
            <Box bgcolor='white'>
                <Navbar />
                <Cliente value={convenio as any} />
                <Box sx={{ pb: { xs: 5, md: 0 } }}>
                    <Footer />
                </Box>
            </Box>
        );

    }
    else
        return notFound();
}
