import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Evento } from "@prisma/client";
import Footer from "@/app/static/Footer";
import Cliente from "./Cliente";
import { Metadata } from "next";
import { notFound } from "next/navigation";
type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}
const get = async (id: string) => {
    return await prisma.evento.findUnique({
        where: { id }
    });
}

const incrementarVista = async (id: string) => {
    await prisma.evento.update({ where: { id }, data: { conteo: { increment: 1 } } })
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const Evento = await get(params.id);
    if (Evento)
        return {
            title: Evento.titulo
        }
    else
        return notFound();
}

export default async function Home({ params }: any) {
    const value = await get(params.id) as Evento;
    if (value) {
        await incrementarVista(params.id)
        return (
            <Box bgcolor='#f4f6f8'>
                <Navbar />
                <Cliente value={value as any} />
                <Footer />
            </Box>
        );
    }
    else
        return notFound();
}
