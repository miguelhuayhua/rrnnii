import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { tipo, skip, id, continente, take } = await request.json();
        take = take || 15;
        skip = skip || 0;
        let becas = await prisma.beca.findMany({
            where: {
                estado: true,
                id: { not: id || undefined },
                tipo,
                continente: continente ? continente.toUpperCase() : undefined
            },
            skip: skip * take,
            include: {
                Participantes: true,
                Institucion: true
            },
            take
        });
        return Response.json(becas);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };