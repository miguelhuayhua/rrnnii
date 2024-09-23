import { prisma } from "@/app/api/client";
import Navbar from "@/app/static/Navbar";
import { Box } from "@mui/material";
import { Convenio, Evento } from "@prisma/client";
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

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const Evento = await get(params.id);
    if (Evento)
        return {
            title: Evento.titulo
        }
    else
        return notFound();
}

export default async function Home(props: any) {
    const value = await get(props.params.id) as Evento;
    return (
        <Box bgcolor='#f4f6f8'>
            <Navbar />
            <Cliente value={value as any} />
            <Footer />
        </Box>
    );
}
