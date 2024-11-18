import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Pasantia } from "@prisma/client";
import Cliente from "./Cliente";
import Footer from "@/app/static/Footer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const get = async (id: string) => {
    return await prisma.pasantia.findUnique({
        where: { id },
        include: {
            Institucion: true,
            PasantiaCarrera: { include: { Carrera: true } }
        }
    });
}

const incrementarVista = async (id: string) => {
    await prisma.pasantia.update({ where: { id }, data: { conteo: { increment: 1 } } })
}

export const generateMetadata = async (props: any): Promise<Metadata> => {
    const pasantia = await get(props.params.id) as Pasantia;
    if (!pasantia) return notFound();
    return ({ title: pasantia.titulo })
}
export default async function Home({ params }: any) {
    const pasantias = await get(params.id) as Pasantia;
    if (pasantias) {
        await incrementarVista(params.id)
        return (
            <Box bgcolor='white'>
                <Navbar />
                <Cliente value={pasantias as any} />
                <Footer />
            </Box>
        );
    }
    else
        return notFound();
}
