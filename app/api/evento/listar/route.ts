import { prisma } from "../../client";
const POST = async (request: Request) => {
    try {
        let { tipo, orden, skip } = await request.json();
        let eventos = await prisma.evento.findMany({
            where: { estado: true, tipo: tipo || undefined },
            skip: skip || undefined
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