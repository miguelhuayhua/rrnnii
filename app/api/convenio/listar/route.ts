import { NextRequest } from "next/server";
import { prisma } from "../../client";
const POST = async (request: NextRequest) => {
    try {
        const { carrera, tipo, skip, id, continente } = await request.json();
        let convenios = await prisma.convenio.findMany({
            include: { Institucion: true, ConvenioCarrera: { include: { Carrera: true } } },
            where: {
                tipo,
                continente: continente ? continente.toUpperCase() : undefined,
                ConvenioCarrera: { some: { carreraId: carrera } },
                id: { not: id },
                estado: true
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