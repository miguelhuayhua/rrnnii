import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        let { duracion, orden, carrera, id, take, skip } = await request.json();
        take = take || 15;
        skip = skip || 0;
        let pasantias = await prisma.pasantia.findMany({
            include: { Institucion: true, PasantiaCarrera: { include: { Carrera: true } } },
            where: {
                modalidad: duracion || undefined,
                PasantiaCarrera: { some: { carreraId: carrera || undefined } },
                id: { not: id }
            },
            orderBy: { createdAt: orden == '0' ? 'desc' : 'asc' },
            take,
            skip: skip * take
        });
        return Response.json(pasantias);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };