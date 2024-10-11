import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        const { tipo, skip, id, continente, take } = await request.json();
        let becas = await prisma.beca.findMany({
            where: {
                estado: true,
                id: { not: id || undefined },
                tipo,
                continente: continente ? continente.toUpperCase() : undefined
            },
            skip: skip || undefined,
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