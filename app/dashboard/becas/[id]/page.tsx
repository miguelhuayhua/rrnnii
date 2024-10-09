import { prisma } from "@/app/api/client";
import Cliente from "./Cliente";
import { notFound } from "next/navigation";

const get = async (id: string) => {
    return await prisma.beca.findUnique({
        where: { id },
        include: { Institucion: true, Participantes: true }
    });
}
export default async function page({ params }: any) {
    const Beca = await get(params.id)
    if (!Beca) return notFound();
    return (
        <Cliente Beca={Beca as any} />
    )
}