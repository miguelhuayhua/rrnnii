import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        const { duracion, orden, carrera } = await request.json();
        let pasantias = await prisma.pasantia.findMany({
            include: { Institucion: true, PasantiaCarrera: { include: { Carrera: true } } },
            where: {
                modalidad: duracion || undefined,
                PasantiaCarrera: { some: { carreraId: carrera || undefined } }
            },
            orderBy: { createdAt: orden == '0' ? 'desc' : 'asc' }
        });
        return Response.json(pasantias);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };