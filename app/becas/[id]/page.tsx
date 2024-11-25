import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { Beca } from "@prisma/client";
import Cliente from "./Cliente";
import Footer from "@/app/static/Footer";
import { notFound } from "next/navigation";

const get = async (id: string) => {
    return await prisma.beca.findUnique({
        where: { id },
        include: {
            Institucion: true,
            Participantes: true
        }
    });
}

const incrementarVista = async (id: string) => {
    await prisma.beca.update({ where: { id }, data: { conteo: { increment: 1 } } })
}


export const generateMetadata = async (props: any): Promise<Metadata> => {
    const beca = await get(props.params.id) as Beca;
    if (!beca) return notFound();
    return ({ title: beca.titulo })
}

export default async function Home({ params }: any) {
    const beca = await get(params.id) as Beca;
    if (beca) {
        await incrementarVista(params.id);
        return (
            <Box bgcolor='white'>
                <Navbar />
                <Cliente value={beca as any} />
                <Box sx={{ pb: { xs: 5, md: 0 } }}>
                    <Footer />
                </Box>
            </Box>
        );

    }
    else
        return notFound();
}
