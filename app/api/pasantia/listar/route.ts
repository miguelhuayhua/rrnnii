import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        const { carrera, modalidad, orden } = await request.json();
        let pasantias = await prisma.pasantia.findMany({
            include: { Institucion: true, PasantiaCarrera: { include: { Carrera: true } } },
            where: {
                modalidad,
                PasantiaCarrera: { some: { carreraId: carrera } }

            }
        });
        return Response.json(pasantias);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };