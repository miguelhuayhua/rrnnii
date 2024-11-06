import { prisma } from "@/app/api/client";
import Cliente from "./Cliente";
import { notFound } from "next/navigation";

const get = async () => {
    return await prisma.unidad.findUnique({
        where: { id: 'rrnnii' }
    });
}
export default async function page({ params }: any) {
    const Unidad = await get();
    if (!Unidad) return notFound();
    return (
        <Cliente Unidad={Unidad} />
    )
}