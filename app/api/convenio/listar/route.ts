import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        const { carrera, tipo, skip, id } = await request.json();
        let convenios = await prisma.convenio.findMany({
            include: { Institucion: true, ConvenioCarrera: { include: { Carrera: true } } },
            where: {
                tipo,
                ConvenioCarrera: { some: { carreraId: carrera } },
                id: { not: id }
            },
            skip: skip || undefined
        });
        return Response.json(convenios);
    } catch (error) {
        console.log(error)
        return Response.json([]);
    }
}

export { POST };