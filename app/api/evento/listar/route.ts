import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { tipo, orden, id, take, skip } = await request.json();
        take = take || 15;
        skip = skip || 0;
        let eventos = await prisma.evento.findMany({
            where: {
                estado: true, tipo: tipo || undefined,
                id: { not: id }
            },
            orderBy: { createdAt: orden == '0' ? 'desc' : 'asc' },
            take,
            skip: take * skip
        });
        return Response.json(eventos);
    } catch (error) {
        console.log(error)
        return Response.json({
            error: true,
        });
    }
}

export { POST };